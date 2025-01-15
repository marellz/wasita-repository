import moment from "moment"

const parseDate = (date: string) => {
  return moment(date).format("MMMM Do YYYY, h:mm a")
}

export default parseDate
