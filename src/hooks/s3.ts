import { api } from "../utils/api";

export const useFetchS3BucketContents = ({
  prefix,
  projectId,
  aws_s3_bucket_name,
}: {
  prefix: string;
  projectId: string;
  aws_s3_bucket_name: string;
}) => {
  const { data, isLoading } = api.s3.fetchS3BucketContents.useQuery({
    prefix: prefix,
    projectId: projectId,
    aws_s3_bucket_name: aws_s3_bucket_name,
  });
  return {
    files: data,
    isLoading: isLoading,
  };
};

export const useDeleteS3Object = () => {
  const utils = api.useContext();
  const { mutate: deleteS3Object } = api.s3.deleteS3Object.useMutation({
    async onMutate({ prefix, fileId, projectId, aws_s3_bucket_name }) {
      await utils.s3.fetchS3BucketContents.cancel();
      const previousData = utils.s3.fetchS3BucketContents.getData();
      utils.s3.fetchS3BucketContents.setData(
        {
          prefix: prefix,
          projectId: projectId,
          aws_s3_bucket_name: aws_s3_bucket_name,
        },
        (oldFileData) => {
          if (oldFileData) {
            const newFileData = oldFileData?.filter(
              (oldFileDatum) => oldFileDatum?.id !== fileId
            );
            return newFileData;
          } else {
            return oldFileData;
          }
        }
      );
      return () =>
        utils.s3.fetchS3BucketContents.setData(
          {
            prefix: prefix,
            projectId: projectId,
            aws_s3_bucket_name: aws_s3_bucket_name,
          },
          previousData
        );
    },
    onError(error, values, rollback) {
      if (rollback) {
        rollback();
      }
    },
    onSuccess(data, { prefix, fileId, projectId, aws_s3_bucket_name }) {
      utils.s3.fetchS3BucketContents.setData(
        {
          prefix: prefix,
          projectId: projectId,
          aws_s3_bucket_name: aws_s3_bucket_name,
        },
        (oldFileData) => {
          if (oldFileData) {
            const newFileData = oldFileData?.filter(
              (oldFileDatum) => oldFileDatum?.id !== fileId
            );
            return newFileData;
          } else {
            return oldFileData;
          }
        }
      );
    },
    async onSettled(data, error, { prefix, projectId, aws_s3_bucket_name }) {
      await utils.s3.fetchS3BucketContents.invalidate({
        aws_s3_bucket_name: aws_s3_bucket_name,
        projectId: projectId,
        prefix: prefix,
      });
    },
  });
  return {
    deleteS3Object,
  };
};

export const useGetPreSignedURLForDownload = () => {
  const { mutateAsync: getPreSignedURLForDownload } =
    api.s3.getPreSignedURLForDownload.useMutation();
  return {
    getPreSignedURLForDownload: getPreSignedURLForDownload,
  };
};

export const useGetPreSignedURLForUpload = () => {
  const { mutateAsync: getPreSignedURLForUpload } =
    api.s3.getPreSignedURLForUpload.useMutation();
  return {
    getPreSignedURLForUpload: getPreSignedURLForUpload,
  };
};

export const useCreateFolder = () => {
  const utils = api.useContext();
  const { mutate: createFolder } = api.s3.createFolder.useMutation({
    async onMutate({ projectId, prefix, folderName, aws_s3_bucket_name }) {
      await utils.s3.fetchS3BucketContents.invalidate({
        aws_s3_bucket_name: aws_s3_bucket_name,
        projectId: projectId,
        prefix: prefix,
      });
      const previousData = utils.s3.fetchS3BucketContents.getData();
      utils.s3.fetchS3BucketContents.setData(
        {
          projectId: projectId,
          prefix: prefix,
          aws_s3_bucket_name: aws_s3_bucket_name,
        },
        (oldFileData) => {
          const s3Prefix =
            prefix !== "/" ? projectId + "/" + prefix : projectId + "/";
          const optimisticUpdateObject = {
            id: s3Prefix + folderName.replace(/\//g, "_"),
            name: folderName.replace(/\//g, "_"),
            isDir: true,
          };
          if (oldFileData) {
            // no duplicates
            for (const file of oldFileData) {
              if (
                file &&
                file.name == folderName.replace(/\//g, "_") &&
                file.isDir
              ) {
                return oldFileData;
              }
            }
            return [...oldFileData, optimisticUpdateObject];
          } else {
            return [optimisticUpdateObject];
          }
        }
      );
      return () =>
        utils.s3.fetchS3BucketContents.setData(
          {
            projectId: projectId,
            prefix: prefix,
            aws_s3_bucket_name: aws_s3_bucket_name,
          },
          previousData
        );
    },
    onError(error, values, rollback) {
      if (rollback) {
        rollback();
      }
    },
    async onSettled(data, error, { prefix, projectId, aws_s3_bucket_name }) {
      await utils.s3.fetchS3BucketContents.invalidate({
        aws_s3_bucket_name: aws_s3_bucket_name,
        projectId: projectId,
        prefix: prefix,
      });
    },
  });
  return {
    createFolder,
  };
};
