const Editor = {
    props: ['entityObject'],
    data() {
        return {
            entity: this.entityObject
        }
    },
    methods: {
        update() {
            this.$emit('update')
        }
    },
    template: `
     <div class="ui form">
       <div class="field" >
          <textarea rows='4' placeholder='写点东西...' 
          v-model='entity.body'
          @input="update">           
          </textarea>          
       </div>
     </div>   
`
}


const Note = {
    props: [
      "entityObject"
    ],
    data() {
        return {
            entity: this.entityObject,
            open: false
        }
    },
    computed: {
        header() {
            return _.truncate(this.entity.body, {
                length: 30
            })
        },
        updated() {
            return moment(this.entity.meta.updated).fromNow()
        },
        words() {
            return this.entity.body.trim().length
        }
    },
    components: {
        'editor': Editor
    },
    methods: {
        save() {
            loadCollection('notes')
                .then((collection) => {
                    collection.update(this.entity)
                    db.saveDatabase()
                })
        },
        destroy() {
            this.$emit('destroy', this.entity.$loki)
            console.log('trash')
        }
    },
    template: `
   <div class="item">
     <div class="meta">
        {{updated}}
     </div>
     <div class="content">
       <div class="header" 
         @click='open = !open'>
           {{header || '新建笔记'}}
       </div>
       <div class="extra">
       <editor 
        :entity-object = 'entity'
        v-if='open'
        v-on:update='save'>
       </editor>
         {{words}}字
       <i class="right floated trash icon" 
          v-if='open'
          v-on:click='destroy'></i>
       </div>
     </div>
   </div>
`
}


const Notes = {
    data() {
        return {
            entities: []
        }
    },
    created() { //请求数据库数据
        loadCollection('notes').then(collection => {
            //            console.log(collection)
            const _entities = collection.chain()
                .find()
                .simplesort('$loki', 'isdesc')
                .data() //处理数据
            this.entities = _entities //获取数据
            console.log(this.entities)

        })
    },
    methods: {
        create() {
            loadCollection('notes').then(collection => {
                var entity = collection.insert({
                    'body': ''
                })
                db.saveDatabase()
                this.entities.unshift(entity)

            })
        },
        destroy(id) {
            const _entities = this.entities.filter((entity) => {
                return entity.$loki !== id
            })
            this.entities = _entities //删除数据

            loadCollection('notes')
                .then((collection) => {
                    collection.remove({
                        '$loki': id
                    })
                    db.saveDatabase() //数据库删除数据
                })
        }
    },
    components: {
        'note': Note
    },
    template: `
     <div class="ui container notes">
       <h4 class="ui horizontal divider header">
          <li class="paw icon"></li>
          XiaoYang Notes App _ Vue.js
       </h4>
        <a class="ui right floated basic violet button"
        v-on:click="create">添加笔记</a>
        <div class="ui divided items">
             <note 
                v-for="entity in entities"
                v-bind:entityObject = entity
                v-bind:key = "entity.$loki"
                v-on:destroy="destroy">
             </note>
             <span class="ui small disabled header" 
                 v-if="!this.entities.length"> 
             还没有笔记，请按下‘添加笔记’按钮！
             </span>
        </div>
       
     </div>
`
}


const app = new Vue({
    el: '#app',
    components: {
        'notes': Notes
    },
    template: `<notes></notes>`


})
