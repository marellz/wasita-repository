const slugify = (str: string) => {
  const extension = str.split(".").pop()
  const originalName = str.split(".").slice(0, -1).join(".")
  const newName = originalName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()
  const timestamp = Date.now()
  const randomNumber = Math.floor(Math.random() * 1000000)
  return `${newName}_${timestamp}_${randomNumber}.${extension}`
}

export default slugify
