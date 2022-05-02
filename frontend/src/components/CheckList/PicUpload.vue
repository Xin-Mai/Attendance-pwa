<template>
  <div class="clearfix">
    <a-upload
      :file-list="fileList"
      :max-count="4"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      @preview="handlePreview"
    >
      <div v-if="fileList && fileList.length < 8">
        <plus-outlined />
        <div style="margin-top: 8px">Upload</div>
      </div>
    </a-upload>
    <a-modal
      :visible="previewVisible"
      :title="previewTitle"
      :footer="null"
      @cancel="handleCancel"
    >
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
import type { UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default defineComponent({
  name: 'PicUpload',
  components: {
    PlusOutlined,
  },
  setup() {
    const previewVisible = ref(false);
    const previewImage = ref('');
    const previewTitle = ref('');

    const fileList = ref<UploadProps['fileList']>([]);

    const handleCancel = () => {
      previewVisible.value = false;
      previewTitle.value = '';
    };

    const beforeUpload: UploadProps['beforeUpload'] = (file) => {
      const isPic =
        file.type === 'image/png' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg';
      if (!isPic) {
        message.error(`${file.name} is not a png file`);
      }
      return isPic;
    };

    const handlePreview = async (file: any) => {
      if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
      previewTitle.value =
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
    };

    const customRequest = ({ filename, file }) => {
      console.log('upload file', filename, file);
    };

    return {
      previewVisible,
      previewImage,
      fileList,
      beforeUpload,
      handleCancel,
      handlePreview,
      previewTitle,
      customRequest,
    };
  },
});
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
