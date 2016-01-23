import PouchDB from 'pouchdb'

const database = new PouchDB('http://doppler:doppler@localhost:5984/my-pouch-db')

export default database
