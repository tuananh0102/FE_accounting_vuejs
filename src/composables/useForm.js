import { ref } from "vue";

export default function useForm() {
  const isShowForm = ref(false);
  const formMode = ref(0);
  const inputObj = ref();
  const selectedObj = ref();

  function closeForm() {
    isShowForm.value = false;
  }

  function openForm(obj, mode) {
    formMode.value = mode;
    selectedObj.value = obj;
    inputObj.value = { ...obj };
    isShowForm.value = true;
  }

  return { isShowForm, formMode, inputObj, selectedObj, closeForm, openForm };
}
