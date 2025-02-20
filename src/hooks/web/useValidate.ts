import { FormInstance } from 'element-plus'
import { ref, Ref } from 'vue'

export function useValidate(
  formRef: Ref<FormInstance | undefined>
): [Ref<FormInstance | undefined>, (callback?: () => any, fail?: () => any) => boolean] {
  const validateSubmit = (callback?: () => void, fail?: () => void) => {
    let validPassed = false
    formRef.value?.validate((valid) => {
      if (valid) {
        validPassed = true
        callback?.()
        return true
      }
      validPassed = false
      return false
    })
    return validPassed
  }

  return [formRef, validateSubmit]
}
