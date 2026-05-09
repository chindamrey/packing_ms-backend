<template>
    <form class="grid gap-3 content-start">
        <div>
            <BaseInput label="Name *" v-model="formData.name" :error="errors.name"
                @blur="validateField('name', formData.name, 'Name is required')" />
        </div>

        <div>
            <BaseInput label="Number Instand *" type="number" v-model="formData.number_instand"
                :error="errors.number_instand"
                @blur="validateField('number_instand', formData.number_instand, 'Number instand is required')" />
        </div>
        <!-- <div>
            <label class="form-label mt-3">Category *</label>
            <select class="form-select" v-model="formData.categoryId" :class="{ 'is-invalid': errors.categoryId }"
                @change="validateField('categoryId', formData.categoryId, 'Category is required')">
                <option value="" disabled>Select category</option>
                <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
            <div v-if="errors.categoryId" class="invalid-feedback d-block">
                {{ errors.categoryId }}
            </div>
        </div>

        <div>
            <label class="form-label mt-3">Thumbnail</label>
            <div v-if="thumbnailPreview || existingThumbnail" class="mb-2">
                <img :src="thumbnailPreview || existingThumbnail" alt="Thumbnail Preview"
                    style="max-width: 200px; border-radius: 4px;" />
            </div>
            <input type="file" class="form-control" @change="onThumbnailChange" />
        </div>

        <div>
            <label class="form-label mt-3">Content *</label>
            <textarea v-model="formData.content" class="form-control" rows="8" placeholder="Write content here..."
                :class="{ 'is-invalid': errors.content }"
                @blur="validateField('content', formData.content, 'Content is required')"></textarea>
            <div v-if="errors.content" class="invalid-feedback d-block">
                {{ errors.content }}
            </div>
        </div> -->
    </form>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
// import { useCategoryStore } from '@/stores/category'
import { useRequiredValidator } from '@/composables/useRequiredValidator'
import BaseInput from '@/components/base/BaseInput.vue'

// const categoryStore = useCategoryStore()
const { errors, validateField } = useRequiredValidator()

const formData = ref({
    name: '',
    number_instand:'',
})
const existingThumbnail = ref('') 

const thumbnailPreview = ref('')

const onThumbnailChange = (event) => {
    const file = event.target.files?.[0] || null
    formData.value.thumbnail = file

    if (file) {
        thumbnailPreview.value = URL.createObjectURL(file)
    } else {
        thumbnailPreview.value = ''
    }
}

const validateForm = () => {
    const v1 = validateField('name', formData.value.name, 'Name is required')
    const v2 = validateField('number_instand', formData.value.number_instand, 'Number instand is required')
    return v1 && v2
}

const resetForm = () => {
    formData.value.name = ''
    formData.value.number_instand = ''
    existingThumbnail.value = ''
}

defineExpose({ formData, validateForm })
</script>
