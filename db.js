const db = new loki('notes', { //新建数据库集合名为 notes
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 3000
})

function databaseInitialize() {
    const notes = db.getCollection('notes') //获取notes数据库
    if (notes === null) {
        db.addCollection('notes') //若notes不存在，则增加
    }
}

function loadCollection(collection) {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(collection) || db.addCollection(collection)
            resolve(_collection)
        })
    })
}
