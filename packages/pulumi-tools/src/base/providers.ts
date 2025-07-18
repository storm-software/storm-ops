export enum Provider {
  AWS = "aws",
  AZURE = "azure",
  GOOGLE_CLOUD_PLATFORM = "gcp",
  CLOUDFLARE = "cloudflare"
}

export function getCloudTemplateName(cloudProvider: Provider) {
  return `storm-software_${cloudProvider}`;
}
