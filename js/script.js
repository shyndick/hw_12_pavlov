class User {
    constructor({ id, name, email, address, phone }) {
        this.data = {
            id: id || `${Math.round(performance.now())}`,
            name,
            email,
            address,
            phone,
        };
    }

    edit(data) {
        this.data = data;
    }

    get() {
        return this.data;
    }
}

class Contacts {
    constructor() {
        this.newData = [];
    }

    add(userData) {
        let addedUser = new User(userData);
        this.newData.push(addedUser);
    }

    edit(userId, newUserData) {
        this.newData = this.newData.map((userContact) => {
            const id = userContact.get().id;
            const userData = userContact.get();
            if (id === userId) {
                userContact.edit({
                    ...userData,
                    ...newUserData,
                });
            }
            return userContact;
        });
    }

    remove(userId) {
        this.newData = this.newData.filter((userContact) => {
            const id = userContact.get().id;
            return id !== userId;
        });
    }

    get() {
        return this.newData;
    }
}


class ContactsApp extends Contacts {
    constructor() {
        super()
        this.newData = this.storage || [];
        this.init();
        this.checkCookie();
        this.onAdd();
        this.get()
    }

    init(){
        this.app = document.createElement('div');
        this.app.classList.add('contacts')
        this.app.innerHTML = `<div class="contacts_book">
        <div class="header">
            <h2 class="header_title">Контакты</h2>
            <div class = "contact_add">
                <input type="text" class="contact_name" placeholder="Name" value = 'Alex'>
                <input type="email" class="contact_email" placeholder="Email" value = 'alex@gmail.com'>
                <input type="text" class="contact_address" placeholder="Address" value = 'Bla'>
                <input type="phone" class="contact_phone" placeholder="Phone" value = '465465'>
            </div>
            <button class = "add">Добавить</button>
        </div>
        <div class="book_info">
            <ul class="contacts_items"></ul>
        </div>    
      </div>`
        document.body.appendChild(this.app)
    }

    get storage() {
        let newData = localStorage.getItem('newData');
        let localArr = [];
        if (newData !== null) {

            localArr = JSON.parse(newData);
            localArr = localArr.map((item) => {
                let data = item.data;
                item = new User(data);
                return item;
            })
        } else {
            return undefined;
        }
        return localArr;
    }

    set storage(dataInfo) {
        localStorage.setItem('newData', JSON.stringify(dataInfo))
        this.cookiesLife()
    }

    getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    checkCookie() {
        if (this.getCookie('storageExpiration') === undefined) {
            localStorage.clear();
        }
    }

    cookiesLife() {
        document.cookie = 'storageExpiration; max-age=864000';
    }

    inputsArr() {
        let name = document.querySelector('.contact_name');
        let email = document.querySelector('.contact_email');
        let address = document.querySelector('.contact_address');
        let phone = document.querySelector('.contact_phone');
        return [name, email, address, phone];
    }

    get() {
        const ul = document.querySelector('.contacts_items');
        let li = '';
        let list = super.get();
        list.forEach(({ data: { id, name, email, address, phone } }) => {
            if (id && name && email && address && phone) {
                li += ` <li class="contact_item" id='${id}'>
                            <div class="contact">
                                <p>Имя: ${name}</p>
                                <p>Email: ${email}</p>
                                <p>Адрес: ${address}</p>
                                <p>Телефон: ${phone}</p>
                            </div>
                            <div class="buttons">
                                <button class="btn edit_btn" data-edit="${id}">Редактировать</button>
                                <button class="btn del_btn" data-delete="${id}">Удалить</button>
                            </div>
                        </li>`
            }
        });
        ul.innerHTML = li;
        this.deleteButtonListener();
        this.editButtonListener();
    }

    onAdd() {
        const addBtn = document.querySelector('.add');

        addBtn.addEventListener('click', (event) => {

            let inputs = this.inputsArr();
            let name = inputs[0].value;
            let email = inputs[1].value;
            let address = inputs[2].value;
            let phone = inputs[3].value;
            this.add({name, email, address, phone});
            this.storage = this.newData
            this.get();

            // name = '';
            // email = '';
            // address = '';
            // phone = '';

            inputs[0].value = '';
            inputs[1].value = '';
            inputs[2].value = '';
            inputs[3].value = '';

        });
    }

    editButtonListener() {
        const edit_buttons = document.querySelectorAll('.edit_btn');
        edit_buttons.forEach((editButton) => {
            editButton.addEventListener('click', (event) => {
                let editId = event.target.dataset.edit;
                super.get().find((user) => {
                    if (user.data.id === editId) {
                        this.modal(user.data)
                    }
                })
            })
        });
    }

    onEdit(id, name, email, address, phone) {
        this.edit(id, { id, name, email, address, phone });
        this.storage = this.newData;
        this.get();
    }

    deleteButtonListener() {
        const delete_buttons = document.querySelectorAll('.del_btn');
        delete_buttons.forEach((delete_button) => {
            delete_button.addEventListener('click', (event) => {
                this.onRemove(event.target.dataset.delete);
            })
        })
    }
    onRemove(id) {
        this.remove(id);
        this.storage = this.newData
        this.get();
    }

    

    modal({ id, name, email, address, phone }) {
        const modal = document.createElement("div");
        modal.classList.add("modal");

        modal.innerHTML = `<div class="modal_edit">
                                          <div class="modal_edit_contact">
                                              <h2>Редактирование</h2>
                                              <div class = "edit_inputs">
                                                    <input type="text" class="modal_edit_name" placeholder="Name" value = '${name}'>
                                                    <input type="email" class="modal_edit_email" placeholder="Email" value = '${email}'>
                                                    <input type="text" class="modal_edit_address" placeholder="Address" value = '${address}'>
                                                    <input type="phone" class="modal_edit_phone" placeholder="Phone" value = '${phone}'>
                                                </div>
                                                <button class = 'modal_save'>Сохранить</button>
                                            
                                          </div>
                                         <div>`;
        document.body.appendChild(modal);


        const saveButton = document.querySelector(".modal_save");
        saveButton.addEventListener("click", () => {

            const modalName = document.querySelector('.modal_edit_name');
            const modalEmail = document.querySelector('.modal_edit_email');
            const modalAddress = document.querySelector('.modal_edit_address');
            const modalPhone = document.querySelector('.modal_edit_phone');

            let name = modalName.value;
            let email = modalEmail.value;
            let address = modalAddress.value;
            let phone = modalPhone.value;

            this.onEdit(id, name, email, address, phone)
            modal.remove();
        });

        modal.addEventListener("click", (event) => {
            if (event.target.classList[0] === "modal_edit") {
                modal.remove();
            }
        });
    }

};


let contactsApp = new ContactsApp()

