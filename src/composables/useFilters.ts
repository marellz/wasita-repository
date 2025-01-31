import { onMounted, ref } from "vue"

interface PaginationFilters {
  perPage?: number
  getTotal: () => Promise<number | null>
  getNextPage: () => Promise<void>
}

const usePagination = ({
  perPage: pP = 10,
  getTotal,
  getNextPage,
}: PaginationFilters) => {
  const perPage = ref(pP)
  const pageNumber = ref(1)
  const currentRange = ref({ from: 0, to: perPage.value - 1 })
  const limitReached = ref(false)
  const totalItems = ref<number>()

  const onNextPage = async () => {
    if (limitReached.value) {
      return
    }

    const s = currentRange.value.to + 1
    pageNumber.value++
    currentRange.value = {
      from: s,
      to: s + (perPage.value - 1),
    }

    await getNextPage()
  }

  onMounted(async () => {
    const _t = await getTotal()
    if (_t) {
      totalItems.value = _t
    }
  })

  return {
    perPage,
    pageNumber,
    currentRange,
    limitReached,
    totalItems,
    onNextPage,
  }
}

export default usePagination
