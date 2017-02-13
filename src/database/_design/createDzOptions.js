const dzOptionsDesignDoc = {
  _id: "_design/dzOptions",
  aircraft: [
    "Otter",
    "Caravan",
    "Skyvan",
    "King Air"
  ],
  instructors: [
    "David Rose",
    "Kayla Miller",
    "Kevin Purdy",
    "Rafael Oliveira"
  ]
}

export default function (database, runningInTestMode) {
  database.put(dzOptionsDesignDoc)
    .then(res => runningInTestMode ? f => f : console.log(res))
    .catch(err => console.log(err))
}
