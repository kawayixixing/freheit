/////////////// Book creator controller module /////////////////////

var bookController = (function () {
  //Give each book an ID so that we know the order of the HTML. Used for the "read" sorting too.
  var nextId = 0;

  // Function constructor to build each book as an object
  var Book = function (
    title,
    release,
    author,
    pages,
    level,
    score,
    registered,
    comment,
    image,
    link,
    count
  ) {
    this.title = title;
    this.release = release;
    this.author = author;
    this.pages = pages;
    this.level = level;
    this.score = score;
    this.registered = registered;
    this.comment = comment;
    this.image = image;
    this.link = link;
    this.id = nextId++;
  };

  // An array to store the book objects
  var allBooks = [];

  return {
    // A function to build a book item
    addBook: function (titl, rel, auth, pg, lvl, scr, reg, com, img, lnk, cnt) {
      var newItem;

      newItem = new Book(
        titl,
        rel,
        auth,
        pg,
        lvl,
        scr,
        reg,
        com,
        img,
        lnk,
        cnt
      );

      // Push book to array
      allBooks.push(newItem);
    },

    // Function that returns the array of books and makes it avaliable to other modules.
    getBooklist: function () {
      return allBooks;
    }
  };
})();

//////////////// UI Controller module ///////////////////////////////

var UIcontroller = (function () {
  // Collect all the HTML classes and divs for easy editing if they should change in the HTML file.
  var DOMstrings = {
    bookTitle: "h3",
    bookRelease: ".span__released",
    bookAuthor: ".span__author",
    bookPages: ".span__pages",
    bookLevel: ".span__level",
    bookScore: ".span__score",
    bookRegistered: ".span__registered",
    bookComment: ".book__comment",
    bookImage: ".book__image img",
    categorySelector: "#categorySelector",
    orderSelector: "#orderSelector",
    comment_btn: ".btn__comment",
    comments: ".book__comment",
    commentsWrapper: ".comment__wrapper",
    commentClose: ".btn__close_comment",
    links: ".book__links",
    showMore_btn: ".showMore",
    bookLink: ".span__link a"
  };

  return {
    // A function that collects and returns a books data. We need this for the sorting.
    getInput: function (el) {
      return {
        title: el.querySelector(DOMstrings.bookTitle).innerHTML,
        release: el.querySelector(DOMstrings.bookRelease).innerHTML,
        author: el.querySelector(DOMstrings.bookAuthor).innerHTML,
        pages: el.querySelector(DOMstrings.bookPages).innerHTML,
        level: el.querySelector(DOMstrings.bookLevel).innerHTML,
        score: el.querySelector(DOMstrings.bookScore).innerHTML,
        registered: el.querySelector(DOMstrings.bookRegistered).innerHTML,
        comment: el.querySelector(DOMstrings.bookComment).innerHTML,
        image: el.querySelector(DOMstrings.bookImage).src,
        link: el.querySelector(DOMstrings.bookLink).href
      };
    },

    // A function that return all instances of passed element.
    getElements: function (elmSel) {
      return document.querySelectorAll(elmSel);
    },

    // A function that returns the DOMstrings above so that they are avaliable in other modules.
    getDOMstrings: function () {
      return DOMstrings;
    },

    // A function that displays the books data in the DOM.
    // This is used to overwrite data when sorting.
    // Take elm and overwrite with cont
    displayData: function (elm, cont) {
      return {
        title: (elm.querySelector(DOMstrings.bookTitle).textContent =
          cont.title),
        release: (elm.querySelector(DOMstrings.bookRelease).textContent =
          cont.release),
        author: (elm.querySelector(DOMstrings.bookAuthor).textContent =
          cont.author),
        pages: (elm.querySelector(DOMstrings.bookPages).textContent =
          cont.pages),
        level: (elm.querySelector(DOMstrings.bookLevel).textContent =
          cont.level),
        score: (elm.querySelector(DOMstrings.bookScore).textContent =
          cont.score),
        registered: (elm.querySelector(DOMstrings.bookRegistered).textContent =
          cont.registered),
        comment: (elm.querySelector(DOMstrings.bookComment).innerHTML =
          cont.comment),
        image: (elm.querySelector(DOMstrings.bookImage).src = cont.image),
        link: (elm.querySelector(DOMstrings.bookLink).href = cont.link)
      };
    }
  };
})();

////////////// Global app controller ///////////////////////////

var controller = (function (bookController, UIcontroller) {
  // Get all the HTML book elements.
  var bookList = UIcontroller.getElements(".book__item");

  // Get all the DOMstrings
  var DOM = UIcontroller.getDOMstrings();

  // Get the array with books from the bookController module.
  var bookData = bookController.getBooklist();

  // Checks to see if the list is ascending or descending.
  var isReversed = false;

  // Gets the numer of books.
  var numberOfBooks = bookList.length;

  // A variable to controll how many books to be visible on load.
  var visibleItems = 6;

  // A variable to hold remaining books (not visible)
  var remainingItems;

  // A variable to controll how many books to load when pressing "load more" button.
  var booksToLoad = 4;

  // Loop through the list and create new book objects and generate the list to display in DOM.
  function makeDOMList() {
    // A coounter used for calculating number of remaining books (not visible).
    var count = 0;

    // A for loop creating the books and collect them in an array.
    for (i = 0; i < numberOfBooks; i++) {
      count += 1;

      // Collect the different data from the HTML list.
      var input = UIcontroller.getInput(bookList[i]);

      // Create the bookelements through the book constructor with the data collected above.
      bookController.addBook(
        input.title,
        input.release,
        input.author,
        input.pages,
        input.level,
        input.score,
        input.registered,
        input.comment,
        input.image,
        input.link
      );

      // Define each books comment field, which will be made avaliable through a button.
      var overlay = bookList[i].querySelector(DOM.comments);

      // Create each books event handler to show comment field.
      bookList[i].addEventListener(
        "click",
        function (evt) {
          var target = evt.target;

          // If the button is the "open comment" show comment field.
          if (target.className === "btn__comment") {
            this.querySelector(DOM.commentsWrapper).style.display = "block";
            this.querySelector(DOM.commentsWrapper).classList.remove(
              "close_comment"
            );
            this.querySelector(DOM.commentsWrapper).classList.add(
              "open_comment"
            );

            // If the button is "close comment" we hide the comment field.
          } else if (target.className === "btn__close_comment") {
            this.querySelector(DOM.commentsWrapper).classList.remove(
              "open_comment"
            );
            this.querySelector(DOM.commentsWrapper).classList.add(
              "close_comment"
            );
          }
        },
        false
      );

      // Hide all the books that is above amount of visibleItems
      if (i >= visibleItems) {
        bookList[i].style.display = "none";
      }
    }

    // Calculate remaining books.
    remainingItems = count - visibleItems;

    // Display the remaining books in the "show more" button.
    document.querySelector(DOM.showMore_btn).innerHTML =
      "Show more " + "(" + remainingItems + ")";
  }

  // The "show more" button at the bottom of the list. Iterates through the list,
  // displays more books and updates the "remaining books" number displayed in the
  // "show more" button.
  function loadMoreBooks() {
    if (numberOfBooks - visibleItems - booksToLoad > 0) {
      visibleItems = visibleItems + booksToLoad;
    } else {
      visibleItems = numberOfBooks;
    }

    for (i = numberOfBooks - remainingItems; i < visibleItems; i++) {
      bookList[i].style.display = "block";
    }

    remainingItems = remainingItems - booksToLoad;

    // Hide the button if reminding books is 0 or less
    if (remainingItems < 0) {
      remainingItems = 0;
      document.querySelector(DOM.showMore_btn).style.display = "none";
    } else {
      document.querySelector(DOM.showMore_btn).innerHTML =
        "Show more " + "(" + remainingItems + ")";
    }
  }

  // Set up buttons
  var setupEventListeners = function () {
    // Define the category selector.
    document
      .querySelector(DOM.categorySelector)
      .addEventListener("change", selectCategory);

    // Define the sorting order selector.
    document
      .querySelector(DOM.orderSelector)
      .addEventListener("change", changeOrder);

    // Define the load more button.
    document
      .querySelector(DOM.showMore_btn)
      .addEventListener("click", loadMoreBooks);
  };

  // Function to make us define what property we want to sort on.
  function propComparator(prop) {
    return function (a, b) {
      return a[prop] - b[prop];
    };
  }

  // The function that sorts the list when choosing a category: score, read, title etc.
  var selectCategory = function () {
    // Get the value of the selector to use in sorting.
    var selected = document.querySelector(DOM.categorySelector).value;

    // A function that sorts the list with the value of the selector.
    function compare(a, b) {
      if (a[selected] < b[selected]) return -1;

      if (a[selected] > b[selected]) return 1;
      return 0;
    }

    // A sorting function that uses the ID of the book object to sort.
    function compareID(a, b) {
      return a.id - b.id;
    }

    // If selecting "read" than sort on ID...
    if (selected === "registered") {
      bookData.sort(compareID);

      // ... else sort on value
    } else {
      bookData.sort(compare);
    }

    // If order selector is descending, reverse list.
    if (isReversed === true) {
      bookData.reverse();
    }

    // Iterate through the list and get the data of the books now that it is sorted.
    // Push the data out to the DOM to see the list in the correct sorting order.
    for (i = 0; i < bookList.length; i++) {
      // Get the data
      var input = UIcontroller.getInput(bookList[i]);

      // Push the data to DOM (overwrite).
      UIcontroller.displayData(bookList[i], bookData[i]);
    }
  };

  // Change the order of the list. Ascending/descending.
  var changeOrder = function () {
    // Get the value of the selector.
    var order = document.querySelector(DOM.orderSelector).value;

    if (order === "descending") {
      bookData.reverse();

      // Iterate through the list and get the data.
      for (i = 0; i < bookList.length; i++) {
        // Get the data
        var input = UIcontroller.getInput(bookList[i]);

        // Push the data to DOM (overwrite).
        UIcontroller.displayData(bookList[i], bookData[i]);
      }

      // Change the value of isReversed to true
      isReversed = true;
    } else if (isReversed === true) {
      bookData.reverse();

      for (i = 0; i < bookList.length; i++) {
        var input = UIcontroller.getInput(bookList[i]);

        UIcontroller.displayData(bookList[i], bookData[i]);
      }

      isReversed = false;
    }
  };

  return {
    init: function () {
      makeDOMList();
      setupEventListeners();
    }
  };
})(bookController, UIcontroller);

controller.init();

