const FormAutoFill = new Vue({
  el: '#app',
  data: {

    // Google Apps Script 部署為網路應用程式後的 URL
    gas: 'https://script.google.com/macros/s/AKfycbxY5dBi94Juwp_wknsEoIU9BUO97HmSNVdouHZwrj3zW02OkGXNdifz8n06MR0LmUr6/exec',

    id: '',

    // 避免重複 POST，存資料用的
    persons: {},

    // 頁面上吐資料的 data
    person: {},

    // Google Form 的 action URL
    formAction: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfNiIcF6XhDAk-740SC2NuM2Stkz44OR2srOknJflOSLA78UQ/formResponse',

    // Google Form 各個 input 的 name
    input: {
      id:'entry.357808092',
      name:'entry.263048923',
      num:'entry.2104820911',
      bills:'entry.1374935834',
      diff:'entry.1257048439'
    },
    //msg: 'entry.2119587168'
  

    // loading 效果要不要顯示
    loading: true
  },
  methods: {
    // ID 限填 4 碼
    limitIdLen(val) {
      if(val.length > 4) {
        return this.id =  this.id.slice(0, 4);
      }
    },
    // 送出表單
    submit() {
      // 再一次判斷是不是可以送出資料
      if(this.person.name !== undefined) {
        let params = `${this.input.id}=${this.person.id}&${this.input.name}=${this.person.name}&${this.input.gender}=${this.person.gender}&${this.input.phone}=${this.person.phone}&${this.input.site}=${this.person.site}&${this.input.msg}=${this.person.message || '無'}`;
        fetch(this.formAction + '?' + params, {
          method: 'POST'
        }).catch(err => {
            alert('提交成功。');
            this.id = '';
            this.person = {};
          })
      }
    }
  },
  watch: {
    id: function(val) {
      // ID 輸入到 4 碼就查詢資料
      if(val.length === 4) {

        // this.persons 裡沒這筆資料，才 POST
        if(this.persons[this.id] === undefined) {
          this.loading = true;
          let uri = this.gas + '?id=' + this.id;
          fetch(uri, {
            method: 'POST'
          }).then(res => res.json())
            .then(res => {
              this.persons[this.id] = res; // 把這次查詢的 id 結果存下來
              this.person = res;
              this.loading = false;
            })
        }
        // this.persons 裡有資料就吐資料
        else {
          this.person = this.persons[this.id];
        }

      }
    }
  }
})
