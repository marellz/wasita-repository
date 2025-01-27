<template>
  <div class="group relative">
    <div class="flex items-start space-x-2">
      <div
        class="flex-none after:h-full after:w-0.5 after:bg-slate-200 after:block after:absolute after:left-6 after:-translate-x-1/2 group-last:after:hidden"
      >
        <UserAvatar :avatar="comment.user.avatar_url" />
      </div>
      <div class="flex-auto">
        <div class="flex flex-col bg-slate-100 rounded-xl p-2">
          <div class="flex items-center space-x-3">
            <p class="font-medium font-secondary py-1.5">
              {{ comment.user.name }}
            </p>
            <p class="text-xs text-gray-500">
              {{ parseDate(comment.created_at) }}
            </p>
            <div class="!ml-auto">
              <button
                v-if="comment.user_id === auth.user?.id"
                class="p-2 rounded hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100"
                type="button"
                @click="deleteComment(comment.id)"
              >
                <Trash2 :size="20" />
              </button>
            </div>
          </div>
          <p class="font-light">
            {{ comment.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import UserAvatar from "@/components/user/avatar.vue"
import { useAuthStore } from "@/stores/auth"
import type { Remark } from "@/stores/remarks"
import parseDate from "@/utils/parseDate"
import { Trash2 } from "lucide-vue-next"
defineProps<{
  comment: Remark
}>()

const auth = useAuthStore()

const emit = defineEmits(["delete-comment"])

const deleteComment = (id: number) => {
  emit("delete-comment", id)
}
</script>
