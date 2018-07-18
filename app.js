const Note = {
    props: [
      "entityObject"
    ],
    template: `
   <div class="item">
     <div calss="content">
       <div calss="header">笔记</div>
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
    components: {
        'note': Note
    },
    template: `
     <div class="ui container notes">
       <h4 class="ui horizontal divider header">
          <li class="paw icon"></li>
          XiaoYang Notes App _ Vue.js
       </h4>
        <a class="ui right floated basic violet button">添加笔记</a>
        <div class="ui divided items">
             <note 
                v-for="entity in entities"
                v-bind:entityObject = entity
                v-bind:key = "entity.$loki">
             </note>
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
