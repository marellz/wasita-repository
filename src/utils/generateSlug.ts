import useCustomId from "@/composables/useCustomId"

const generateName = (str: string, randomString: boolean = false) => {
  const extension = str.split(".").pop()
  let newName
  if (randomString) {
    newName = useCustomId(10)
  } else {
    const originalName = str.split(".").slice(0, -1).join(".")
    newName = originalName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()
  }
  const timestamp = Date.now()
  const randomNumber = Math.floor(Math.random() * 1000000)
  return `${newName}_${timestamp}_${randomNumber}.${extension}`
}

export default generateName
