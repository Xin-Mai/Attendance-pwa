<template>
  <a-upload
    v-model:file-list="fileList"
    name="avatar"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :before-upload="beforeUpload"
  >
    <div v-if="imageUrl" class="img-container">
      <img :src="imageUrl" alt="avatar" style="width: 100%; height: 100%" />
      <DeleteOutlined
        class="delete-button"
        style="color: red"
        @click.stop="clear"
      />
    </div>
    <div v-else>
      <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text">Upload</div>
    </div>
  </a-upload>
</template>
<script lang="ts">
import {
  PlusOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { defineComponent, ref, Ref, watch } from 'vue';
import type { UploadProps } from 'ant-design-vue';

function getBase64(img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}
export default defineComponent({
  components: {
    LoadingOutlined,
    PlusOutlined,
    DeleteOutlined,
  },
  props: {
    imgUrl: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const fileList: Ref<File> = ref(new Array<File>());
    const loading = ref<boolean>(false);
    const imageUrl = ref<string>('');

    watch(
      () => props.imgUrl,
      (newVal) => {
        imageUrl.value = newVal;
      }
    );

    const beforeUpload = (file: File) => {
      loading.value = true;
      const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG file!');
        loading.value = false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
        loading.value = false;
      }
      if (isLt2M && isJpgOrPng) {
        fileList.value = [file];
        getBase64(file, (base64Url: string) => {
          imageUrl.value = base64Url;
          loading.value = false;
        });
      }
      return false;
    };

    return {
      fileList,
      loading,
      imageUrl,
      beforeUpload,
      getPic: () => {
        return '' + imageUrl.value;
      },
      clear: () => {
        imageUrl.value = '';
        fileList.value = [];
      },
    };
  },
});
</script>
<style>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.img-container {
  width: 100%;
  height: 100%;
}

.delete-button {
  z-index: 2;
}
</style>
