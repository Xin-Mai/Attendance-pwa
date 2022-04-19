<template>
  <common-header title="主页" :backable="false"></common-header>
  <div class="container">
    <a-card class="header">
      <h1 class="header-text">{{ name }}老师，你好</h1>
      <a-button class="header-button" type="link" danger @click="signOut">
        登出
      </a-button>
    </a-card>
    <a-card class="tree-container" title="课程与班级">
      <template #extra>
        <a-button
          v-if="manageable"
          type="link"
          @click="handleAdd(AddType.COURSE)"
        >
          添加课程
        </a-button>
        <a-switch
          v-model:checked="manageable"
          checked-children="管理"
          un-checked-children="管理"
        />
      </template>
      <a-tree
        v-if="treeData.length"
        :checkable="manageable"
        :checked-keys="checkedKeys"
        :auto-expand-parent="true"
        default-expand-all
        :tree-data="treeData"
        :selectable="true"
        @check="onCheck"
      >
        <template #title="{ title, key }">
          <!--是课程-->
          <div v-if="/-/.test(key)">
            <a-button type="link" @click="checkPresent(key)">{{
              title
            }}</a-button>
            <EditOutlined
              v-show="manageable"
              class="icon"
              @click="manage(key)"
            />
          </div>
          <div v-else>
            <span class="parent-node">{{ title }}</span>
            <PlusOutlined
              v-show="manageable"
              class="icon"
              @click="handleAdd(AddType.CLASS, title)"
            />
          </div>
        </template>
      </a-tree>
    </a-card>
    <add-modal
      ref="addModal"
      :title="isAddCourse === AddType.COURSE ? '新增课程' : '新建班级'"
      :visible="showModal"
      :confirm-loading="modalLoading"
      @submit="addSubmit"
      @close="closeModal"
    ></add-modal>
    <common-footer :show="manageable">
      <a-button type="link" danger @click="removeClass">删除班级</a-button>
    </common-footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref } from 'vue';
import { Router, useRouter } from 'vue-router';

import { Modal } from 'ant-design-vue';
import { EditOutlined, PlusOutlined } from '@ant-design/icons-vue';
import AddModal from '/@/components/Classes/AddModal.vue';
import CommonHeader from '/@/components/common/Header.vue';
import CommonFooter from '/@/components/common/Footer.vue';

import type { TreeProps } from 'ant-design-vue';
import { DataNode } from 'ant-design-vue/lib/tree';

import {
  CoursesListApi,
  CoursesAddApi,
  ClassAddApi,
  ClassRemoveApi,
} from '/@/api/course';

import Store from '/@/store/store';
// import { CourseItem } from '../schemas';
import { CourseListResponseItem } from '../api/schema';
import { signOut } from '/@/utils/redirect';

export default defineComponent({
  name: 'ClassesList',
  components: {
    EditOutlined,
    PlusOutlined,
    AddModal,
    CommonHeader,
    CommonFooter,
  },
  setup() {
    const router: Router = useRouter();
    enum AddType {
      COURSE = 0,
      CLASS = 1,
    }
    const checkable: Ref<boolean> = ref(false);
    const checkedKeys: Ref<string[]> = ref([]);
    const manageable: Ref<boolean> = ref(false);
    // 模拟的数据
    // const data: CourseItem[] = [
    //   {
    //     course: '软件工程',
    //     classes: ['软件1806', '软件1805'],
    //   },
    //   {
    //     course: '编译原理',
    //     classes: [],
    //   },
    // ];
    const dataSource: Ref<CourseListResponseItem[]> = ref([]);
    // const data: CoursesList = await
    const getData = () => {
      CoursesListApi().then((val) => {
        dataSource.value = val as unknown as CourseListResponseItem[];
      });
    };
    getData();
    // 处理数据
    const treeData = computed(() => {
      const treeArr: TreeProps['treeData'] = [];
      const data = dataSource.value;
      for (let i = 0; i < data.length; i++) {
        const record = data[i];
        // 可能需要去重
        const subNode: DataNode[] = [];
        for (let j = 0; j < record.classes.length; j++) {
          subNode.push({
            title: record.classes[j],
            key: i + '-' + j,
          });
        }
        treeArr.push({
          title: record.course,
          key: '' + i,
          children: subNode,
        });
      }
      return treeArr;
    });

    // 管理模式
    const manage = (key) => {
      console.log('manage:', key);
    };
    // 选中节点
    const onCheck = (keys: string[]) => {
      checkedKeys.value = keys;
    };

    // 跳转到考勤页面
    const checkPresent = (key: string) => {
      const arr: string[] | null = key.match(/([0-9]+)/g);
      if (!arr || arr.length < 2) return;
      router.push({
        // name: 'check',
        name: 'classHomePage',
        params: {
          course: dataSource.value[parseInt(arr[0])].course,
          className:
            dataSource.value[parseInt(arr[0])].classes[parseInt(arr[1])],
        },
      });
    };

    // 添加课程
    const showModal: Ref<boolean> = ref(false);
    const modalLoading: Ref<boolean> = ref(false);
    const addModal = ref();
    const isAddCourse: Ref<AddType> = ref(AddType.COURSE);
    const curCourse: Ref<string> = ref('');
    // 查看新添加的课程是否已重复
    const handleAdd = (type: AddType, course?: string) => {
      showModal.value = true;
      isAddCourse.value = type;
      if (course && type === AddType.CLASS) {
        curCourse.value = course;
      }
    };

    const checkDuplicate = (newVal: string): boolean => {
      switch (isAddCourse.value) {
        case AddType.COURSE:
          for (const record of dataSource.value) {
            if (record.course === newVal) {
              return false;
            }
          }
          break;
        case AddType.CLASS:
          for (const record of dataSource.value) {
            if (record.course === curCourse.value) {
              for (const classItem of record.classes) {
                if (classItem === newVal) {
                  return false;
                }
              }
            }
          }
          break;
      }
      return true;
    };

    const addSubmit = async (name: string) => {
      modalLoading.value = true;
      try {
        switch (isAddCourse.value) {
          case AddType.COURSE:
            await addCourse(name);
            break;
          case AddType.CLASS:
            await addClass(name);
            break;
        }
        modalLoading.value = false;
        showModal.value = false;
        addModal.value?.clear();
        getData();
      } catch (err) {
        modalLoading.value = false;
        addModal.value?.showFailedMessage(`${err} 添加失败`);
      }
    };

    // 添加课程
    const addCourse = async (course: string) => {
      // 看名字是否重复
      if (checkDuplicate(course)) {
        await CoursesAddApi({ course });
        showModal.value = false;
      } else {
        throw `${course}课程已存在`;
      }
    };

    // 添加班级
    const addClass = async (className: string) => {
      if (checkDuplicate(className)) {
        await ClassAddApi({ course: curCourse.value, className });
      } else {
        throw '班级已存在';
      }
    };

    // 删除班级
    const filterRemoveParams = (): CourseListResponseItem[] => {
      const selected: string[] = checkedKeys.value;
      const paramsMap: Map<string, CourseListResponseItem> = new Map();
      for (const key of selected) {
        const index: string[] | null = key.match(/([0-9]+)/g);
        if (!index || index.length < 2) continue;
        const val = paramsMap.get(index[0]);
        if (val) {
          val.classes.push(
            dataSource.value[parseInt(index[0])].classes[parseInt(index[1])]
          );
        } else {
          const course = dataSource.value[parseInt(index[0])].course;
          const className =
            dataSource.value[parseInt(index[0])].classes[parseInt(index[1])];
          paramsMap.set(index[0], { course, classes: [className] });
        }
      }
      return Array.from(paramsMap.values());
    };

    const removeClass = () => {
      const params = filterRemoveParams();
      showConfirm(params);
    };

    function showConfirm(params: CourseListResponseItem[]) {
      if (params.length === 0) {
        Modal.info({
          title: '请至少选择一个需要删除的班级',
          okText: '确认',
          cancelText: '取消',
        });
      } else {
        const content: string = params.reduce(
          (val, cur) => `${val} ${cur.course}：${cur.classes.toString()}`,
          ''
        );
        Modal.confirm({
          title: '确认删除下列班级?',
          content,
          okText: '确认',
          cancelText: '取消',
          async onOk() {
            try {
              // 发送删除请求
              await ClassRemoveApi(params);
              getData();
            } catch {
              return console.log('Oops errors!');
            }
          },
          onCancel() {},
        });
      }
    }

    return {
      addModal,
      AddType,
      name: Store.state.username,
      checkable,
      checkedKeys,
      onCheck,
      treeData,
      manage,
      manageable,
      checkPresent,
      signOut,
      // 添加课程
      isAddCourse,
      showModal,
      modalLoading,
      closeModal: () => {
        showModal.value = false;
      },
      handleAdd,
      addCourse,
      addClass,
      addSubmit,
      // 删除班级
      removeClass,
    };
  },
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 1rem;
  background-color: #eeeeee;
  display: flex;
  justify-content: start;
  flex-direction: column;
}

.footer {
  z-index: 2;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 1rem;
  background-color: white;
  box-shadow: 0px -5px 5px #f0f0f0;
  text-align: right;
}
.header {
  /* 0 0 auto */
  flex: none;
}

.header .header-text {
  font-size: 1.125rem;
  line-height: 1.75rem;
  display: inline-block;
}

.header .header-button {
  float: right;
}
.tree-container {
  margin-top: 1rem;
  height: max-content;
  /* 1 1 auto */
  flex: auto;
}

.tree-container :deep(.ant-tree .ant-tree-node-content-wrapper:hover) {
  background-color: transparent;
}

.tree-container
  :deep(.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected) {
  background-color: transparent;
}

.tree-container .icon {
  color: #a9a9a9;
  margin-left: 1rem;
}

.parent-node {
  font-size: 1rem;
}
</style>
