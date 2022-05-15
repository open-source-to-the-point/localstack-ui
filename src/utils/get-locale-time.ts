export const getLocaleTime = (CreationDate: unknown) => {
  return new Date(CreationDate as string).toLocaleString().split(",");
};

const localeDateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "long",
});

export const getLocateDate = (date: Date) => {
  return localeDateFormatter.format(date);
};
