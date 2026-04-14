interface StorageData {
  fileKey: string;
}

interface DeleteBucketOptions extends StorageData {
  jobName?: string;
}

interface StorageProcessorResult {
  success: boolean;
}

export type { StorageData, DeleteBucketOptions, StorageProcessorResult };
