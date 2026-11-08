import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "smartlabs-assets";
const publicDomain = process.env.R2_PUBLIC_DOMAIN || "";

const isR2Configured =
  Boolean(accountId) &&
  Boolean(accessKeyId) &&
  Boolean(secretAccessKey) &&
  !accessKeyId?.includes("cloudflare_r2");

// S3-compatible Cloudflare R2 Client
export const r2Client = isR2Configured
  ? new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    })
  : null;

export interface UploadResult {
  url: string;
  key: string;
  sizeBytes: number;
  contentType: string;
}

/**
 * Uploads a binary buffer (image, video, infographic) to Cloudflare R2 with zero egress fees.
 */
export async function uploadAssetToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  prefix: string = "campaigns"
): Promise<UploadResult> {
  const hash = crypto.randomBytes(8).toString("hex");
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `${prefix}/${Date.now()}-${hash}-${sanitizedFileName}`;

  if (r2Client) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await r2Client.send(command);

    // Compute public zero-egress URL
    const cleanDomain = publicDomain.replace(/\/$/, "");
    const publicUrl = cleanDomain
      ? `${cleanDomain}/${key}`
      : `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key}`;

    return {
      url: publicUrl,
      key,
      sizeBytes: fileBuffer.length,
      contentType,
    };
  }

  // Fallback in local development if R2 credentials are placeholders
  const base64Data = fileBuffer.toString("base64");
  const fallbackDataUrl = `data:${contentType};base64,${base64Data}`;
  return {
    url: fallbackDataUrl,
    key,
    sizeBytes: fileBuffer.length,
    contentType,
  };
}

/**
 * Generates a presigned read URL with an expiration window.
 */
export async function getPresignedAssetUrl(
  key: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  if (!r2Client) {
    return `https://assets.smartlabs.engine/${key}`;
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Deletes an asset from Cloudflare R2.
 */
export async function deleteAssetFromR2(key: string): Promise<boolean> {
  if (!r2Client) return true;

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    await r2Client.send(command);
    return true;
  } catch (err) {
    console.error("Failed to delete asset from R2:", err);
    return false;
  }
}

