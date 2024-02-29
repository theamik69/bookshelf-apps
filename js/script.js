const books = [];
const STORAGE_KEY = 'BOOKSHELF_APPS';
const SAVED_EVENT = 'saved-book';
const RENDER_EVENT = 'render-book';

function generateId() {
    return +new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
    return {
        id, title, author, year, isCompleted
    }
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            console.log(bookItem);
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function makeBook(bookObject) {

    const { id, title, author, year, isCompleted } = bookObject;

    const deleteButton = document.createElement('a');
    deleteButton.classList.add('text-red-500', 'hover:text-red-800', 'ml-2', 'delete-button');
    deleteButton.innerHTML = '<i class="bx bxs-trash"></i>';
    deleteButton.addEventListener('click', function () {
        dataDelete(id);
    });

    const tableButton = document.createElement('td');
    tableButton.classList.add('p-3');
    tableButton.append(deleteButton);

    const tableDataIsCompeted = document.createElement('td');
    tableDataIsCompeted.classList.add('p-3');

    const yearValue = document.createElement('p');
    yearValue.innerText = year;

    const tableDataYear = document.createElement('td');
    tableDataYear.classList.add('p-3');
    tableDataYear.append(yearValue);

    const authorValue = document.createElement('p');
    authorValue.innerText = author;

    const tableDataAuthor = document.createElement('td');
    tableDataAuthor.classList.add('p-3');
    tableDataAuthor.append(authorValue);

    const titleValue = document.createElement('p');
    titleValue.innerText = title;

    const tableDataTitle = document.createElement('td');
    tableDataTitle.classList.add('p-3');
    tableDataTitle.append(titleValue);

    const tableRow = document.createElement('tr');
    tableRow.classList.add('bg-gray-800');
    tableRow.append(tableDataTitle, tableDataAuthor, tableDataYear, tableDataIsCompeted, tableButton);
    tableRow.setAttribute('id', `book-${id}`);

    if (isCompleted === true) {

        const finishedReadButton = document.createElement('button');
        finishedReadButton.classList.add('bg-green-500', 'hover:bg-green-700', 'text-black', 'hover:text-white', 'py-1', 'px-1', 'rounded');
        finishedReadButton.setAttribute('id', 'finished_read');
        finishedReadButton.setAttribute('type', 'button');
        finishedReadButton.innerText = 'Finished reads';
        finishedReadButton.addEventListener('click', function () {
            changeStatus(id);
        });

        tableDataIsCompeted.append(finishedReadButton);
    } else {
        const unfinishedButton = document.createElement('button');
        unfinishedButton.classList.add('bg-red-500', 'hover:bg-red-700', 'text-black', 'hover:text-white', 'py-1', 'px-1', 'rounded');
        unfinishedButton.setAttribute('id', 'unfinished_read');
        unfinishedButton.setAttribute('type', 'button');
        unfinishedButton.innerText = 'Unfinished reads';
        unfinishedButton.addEventListener('click', function () {
            changeStatus(id);
        });

        tableDataIsCompeted.append(unfinishedButton);
    }
    return tableRow;
}

document.addEventListener(RENDER_EVENT, function () {
    const readBooks = document.getElementById('readbook');
    const unreadBooks = document.getElementById('unreadbook');

    readBooks.innerHTML = '';
    unreadBooks.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isCompleted === true) {
            readBooks.append(bookElement);
        } else {
            unreadBooks.append(bookElement);
        }
    }
});

function addBook() {
    const titleBook = document.getElementById('book_title').value;
    const authorBook = document.getElementById('author').value;
    const yearBook = document.getElementById('year').value;
    const isCompletedBook = document.getElementById('my_select').value;

    const yearInt = Number(yearBook);

    const bookStatus = convertBolean(isCompletedBook);

    const generatedID = generateId();
    const bookObject = generateTodoObject(generatedID, titleBook, authorBook, yearInt, bookStatus)
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('bookInput');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
        submitForm.reset();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function convertBolean(isCompletedBook) {
    if (isCompletedBook === "true") {
        return true
    } else {
        return false
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function changeStatus(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    if (bookTarget.isCompleted === true) {
        bookTarget.isCompleted = false
    } else {
        bookTarget.isCompleted = true
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function closeModal() {
    const customDialog = document.querySelector('.modalsection');
    customDialog.style.display = 'none';
}

function openModal() {
    const customDialog = document.querySelector('.modalsection');
    customDialog.style.display = 'block';
}

function dataDelete(bookId) {
    const customDeleteDialog = document.getElementById('confirm-button');
    openModal();
    customDeleteDialog.addEventListener('click', function () {
        deleteBook(bookId);
        closeModal();
    });
}

function deleteBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const cencelButton = document.getElementById('cancel-button');
cencelButton.addEventListener('click', function () {
    closeModal();
});

const searchButton = document.getElementById('button-addon1');
searchButton.addEventListener('click', function () {

    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredBooks = books.filter(function (bookItem) {
        const title = bookItem.title.toLowerCase();
        const author = bookItem.author.toLowerCase();

        return title.includes(searchInput) || author.includes(searchInput);
    });

    const readBooks = document.getElementById('readbook');
    const unreadBooks = document.getElementById('unreadbook');

    readBooks.innerHTML = '';
    unreadBooks.innerHTML = '';

    if (filteredBooks.length === 0) {
        readBooks.innerHTML = '<td colspan="4" style="text-align: center;">Not found</td>';
        unreadBooks.innerHTML = '<td colspan="4" style="text-align: center;">Not found</td>';

    } else {
        for (const bookItem of filteredBooks) {
            const bookElement = makeBook(bookItem);
            if (bookItem.isCompleted === true) {
                readBooks.append(bookElement);
            } else {
                unreadBooks.append(bookElement);
            }
        }
    }
});

