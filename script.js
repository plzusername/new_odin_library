Book.prototype.toggleRead = function(){
    this.read = !this.read
}

Book.prototype.setIndex = function(newIndex){
    this.index = newIndex
}


Book.prototype.editInfo = function(newTitle, newAuthor, newPages, newRead){
    this.title = newTitle
    this.author = newAuthor
    this.pages = newPages
    this.read = newRead
}

function Book(title, author, pages, read){
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.index = null
}

const libraryBooks = {
    libraryMethods:{
        'removeBook': function (bookIndex){
            libraryBooks.booksList.splice(bookIndex, 1)
            libraryBooks.booksList.forEach((book, count) => {
                book.setIndex(count)
            });
        },
        'editBook': function (title, author, pages, read, bookIndex){
            const bookAtIndex = libraryBooks.booksList[bookIndex]

            bookAtIndex.editInfo(title, author, pages, read)
        },

        'addBook': function (book){
            book.setIndex(libraryBooks.booksList.length)
            libraryBooks.booksList.push(book)
        },

        'toggleRead': function(bookIndex){
            this.getAtIndex(bookIndex).toggleRead()
        },

        'getAtIndex': function(bookIndex){
            return libraryBooks.booksList.at(bookIndex)
        }
    },
    booksList:[],
}

const overlay = document.querySelector('.overlay')
const updateModal = document.querySelector('.edit-modal')
const addModal = document.querySelector('.add-modal')
const bookUpdateButton = document.querySelector('.book-update-button')
const bookAddButton = document.querySelector('.book-add-button')
const addBookButton1 = document.querySelector('.add-book-button')
const xMarkButtons = document.querySelectorAll('.fa-xmark')
const forms = document.querySelectorAll('form')

function createElement(tag, attributes, textContent, children = []){
    const element = document.createElement(tag)
    element.textContent = textContent

    for (const attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute])
    }
        children.forEach(child => {
            element.appendChild(child)
    })
    
    return element
}

function reveal(element){
    element.classList.remove('active')
    element.classList.remove('hidden')
    element.classList.add('active')
}

function hide(element){
    element.classList.remove('active')
    element.classList.remove('hidden')
    element.classList.add('hidden')
}

function getInfoFromModal(modal){
    const modalTitle = modal.querySelector('.title-form-section input').value
    const modalAuthor = modal.querySelector('.author-form-section input').value
    const modalPages = modal.querySelector('.page-form-section input').value
    const modalRead = modal.querySelector('.read-form-section input').checked

    return {
        title: modalTitle,
        author: modalAuthor,
        pages: modalPages,
        read: modalRead,
    }
}

addModal.addEventListener('submit', ()=>{
    const modalInfo = getInfoFromModal(addModal)
    const newBook = new Book(modalInfo.title, modalInfo.author, modalInfo.pages, modalInfo.read)

    libraryBooks.libraryMethods.addBook(newBook)
    DOMmethods.renderBooksList()

    addModal.querySelector('#title-input-add').value = ''
    addModal.querySelector('#author-input-add').value = ''
    addModal.querySelector('#page-input-add').value =0
    addModal.querySelector('#read-input-add').checked = false


    hide(overlay)
    hide(addModal)

})
updateModal.addEventListener('submit', ()=>{
    const modalInfo = getInfoFromModal(updateModal)
    const bookIndex = +updateModal.querySelector('h2').textContent.match(/\d+/)

    libraryBooks.libraryMethods.editBook(modalInfo.title, modalInfo.author, modalInfo.pages, modalInfo.read, bookIndex - 1)
    DOMmethods.renderBooksList()

    hide(overlay)
    hide(updateModal)

})

forms.forEach(form => {
    form.addEventListener('submit', event=>{
        event.preventDefault() // prevent actual reload
        if (!form.checkValidity()) {
            form.reportValidity() // show native messages
        }
    })
})

xMarkButtons.forEach(x => {
    x.addEventListener('click', ()=>{
        hide(overlay)
        hide(updateModal)
        hide(addModal)
    })
})

addBookButton1.addEventListener('click', ()=>{
    reveal(overlay)
    reveal(addModal)
})

overlay.addEventListener('click', ()=>{
    hide(overlay)
    hide(updateModal)
    hide(addModal)
})

const DOMmethods = {
    booksContainer: document.querySelector('.books-container'),

    'renderBooksList': function(){
        this.booksContainer.replaceChildren()
        libraryBooks.booksList.forEach(book => {
            this.booksContainer.appendChild(this.renderBook(book))
        })
    },

    'renderBook': function(book){
        const readBox = createElement('i', {class: `${book.read ? 'fa-solid fa-square-check' : 'fa-solid fa-border-none'} read-box`}, '', [])
        const readText = createElement('span', {class: 'read-text'}, `${book.read ? 'Read' : 'Unread'}`, [])

        const editButton = createElement('i', {class:'fa-solid fa-pen-to-square'}, '', [])
        const removeButton = createElement('i', {class:'fa-solid fa-trash'}, '', [])

        const readContainer = createElement('div', {class:'read-container'}, '', [readBox, readText])
        const buttonsContainer = createElement('div', {class:'buttons-container'}, '', [editButton, removeButton])

        const optionsContainer = createElement('div', {class: 'options-container'}, '', [readContainer, buttonsContainer])

        const title = createElement('h2', {class: 'title-text'}, book.title , [])
        const author = createElement('p', {class: 'author-text'}, book.author, [])
        const pages = createElement('p', {class: 'pages-text'}, `${book.pages} pages`, [])

        const bookElement = createElement('div', {class:'book', id:book.index}, '', [title, author, pages, optionsContainer])

        readContainer.addEventListener('click', ()=>{
            libraryBooks.libraryMethods.toggleRead(book.index)
            this.renderBooksList()
        })

        removeButton.addEventListener('click', ()=>{
            libraryBooks.libraryMethods.removeBook(book.index)
            this.renderBooksList()
        })

        editButton.addEventListener('click', ()=>{
            reveal(updateModal)
            reveal(overlay)
            updateModal.querySelector('h2').textContent = `Edit Book #${book.index + 1}`
            updateModal.querySelector('#title-input-edit').value = `${book.title}`
            updateModal.querySelector('#author-input-edit').value = `${book.author}`
            updateModal.querySelector('#page-input-edit').value = book.pages
            updateModal.querySelector('#read-input-edit').checked = book.read

        })

        bookElement.addEventListener('dblclick', ()=>{
            updateModal.querySelector('h2').textContent = `Edit Book #${book.index + 1}`
            updateModal.querySelector('#title-input-edit').value = `${book.title}`
            updateModal.querySelector('#author-input-edit').value = `${book.author}`
            updateModal.querySelector('#page-input-edit').value = book.pages
            updateModal.querySelector('#read-input-edit').checked = book.read

            reveal(updateModal)
            reveal(overlay)
        })

        return bookElement
    },

    'addBook': function (book){
        libraryBooks.libraryMethods.addBook(book)
        this.renderBooksList()
    },

    'removeBook': function (bookIndex){
        libraryBooks.libraryMethods.removeBook(bookIndex)
        this.renderBooksList()
    },

    'editBook': function (book, bookIndex){
        libraryBooks.libraryMethods.editBook(book.title, book.author, book.pages, book.read, bookIndex)
        this.renderBooksList()
    }
}

