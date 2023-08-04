/*
IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs.
This API uses indexes to enable high-performance searches of this data.
IndexedDB is a JavaScript-based object-oriented database.
IndexedDB lets you store and retrieve objects that are indexed with a key; any objects supported by the structured clone algorithm can be stored. You need to specify the database schema, open a connection to your database, and then retrieve and update data within a series of transactions.
One of the main design goals of IndexedDB is to allow large amounts of data to be stored for offline use.
IndexedDB offers several benefits over localStorage. For instance, IndexedDB doesn't block the DOM when used with a worker, unlike localStorage. However, localStorage is slightly faster than IndexedDB. The API of localStorage is also much easier to get started with, making it the more popular choice.
IndexedDB is not reactive. Unlike localStorage, indexedDB does not provide any native events when data is mutated. This makes it cumbersome for front-end components to react on database changes that happens in another tab, window or worker.
*/

// Handle indexedDB.
export const idbPromise = (storeName, method, object) => {
    return new Promise((resolve, reject) => {
        let db, transaction, objectStore;

        /*
        Open a database (but the open request doesn't open the database or start the transaction right away.)
        The first parameter to the open method is the name of database.
        The second parameter to the open method is the version of the database that determines database schema.
        The open call returns an IDBOpenDBRequest object with a result (success) or error value that you handle as an event.
        */
        const request = window.indexedDB.open("LuxboxDatabase", 1);

        // If you create a new database or increase the version number of an existing database, the onupgradeneeded event will be triggered and an IDBVersionChangeEvent object will be passed to any onversionchange event handler set up on request.result.
        // If the onupgradeneeded event exits successfully, the onsuccess handler of the open database request will then be triggered.
        request.onupgradeneeded = (e) => {
            // Save the IDBDatabase interface.
            // Equivalent to `const db = e.target.result;`
            const db = request.result;
            // Create object stores, which are equivalent to tables in RDBMS, for this database.
            db.createObjectStore("products", { keyPath: "_id" });
            db.createObjectStore("shoppingBag", { keyPath: "_id" });
            db.createObjectStore("wishlist", { keyPath: "_id" });
            db.createObjectStore("categories", { keyPath: "_id" });
            db.createObjectStore("subcategories", { keyPath: "_id" });
            db.createObjectStore("clothingSubcategories", { keyPath: "_id" });
            db.createObjectStore("shoesSubcategories", { keyPath: "_id" });
            db.createObjectStore("bagsSubcategories", { keyPath: "_id" });
            db.createObjectStore("jewelryAndAccessoriesSubcategories", { keyPath: "_id" });
            db.createObjectStore("beautySubcategories", { keyPath: "_id" });
            db.createObjectStore("homeSubcategories", { keyPath: "_id" });
            db.createObjectStore("designers", { keyPath: "_id" });
            db.createObjectStore("colors", { keyPath: "_id" });
        };

        // Handle errors.
        request.onerror = (e) => {
            console.error(`Database error: ${request.errorCode}`);
        };

        request.onsuccess = (e) => {
            // Store the result of opening the database in the db variable.
            db = request.result;
            // Open a read/write db transaction, which is a group of operations, ready for adding the data.
            // The transaction() function takes an array of object stores or a string of specified name of one object store
            // And returns a transaction object containing the IDBTransaction.objectStore.
            // The second parameter is the mode of transactions, which is optional. The default access mode is readonly.
            transaction = db.transaction(storeName, "readwrite");

            // Get the object store.
            objectStore = transaction.objectStore(storeName);

            db.onerror = (e) => {
                console.error(`Error: ${e}`);
            };

            switch (method) {
                case 'put':
                    objectStore.put(object);
                    resolve(object);
                    break;
                case 'get':
                    const all = objectStore.getAll();
                    all.onsuccess = () => {
                        resolve(all.result);
                    };
                    break;
                case 'delete':
                    objectStore.delete(object._id);
                    break;
                default:
                    console.log('No valid method');
                    break;
            };

            // When the transaction successfully completed, close the database.
            transaction.oncomplete = () => {
                db.close();
            };
        };
    });
};

// Convert numbers into the currency format of `$100,000`.
export const formatCurrency = (num) => {
    return '$' + num.toLocaleString("en-US");
};

// Convert lower-kebab-cased category names into Pascal cases with spaces.
export const formatCategoryName = (category) => {
    switch (category) {
        case "bags":
            return "Bags";
        case "beauty":
            return "Beauty";
        case "clothing":
            return "Clothing";
        case "home":
            return "Home";
        case "jewelry-and-accessories":
            return "Jewelry & Accessories";
        case "shoes":
            return "Shoes";
        case "new-in":
            return "New In";
        case "sale":
            return "Sale";
        case "designer":
            return "Designer";
        default:
            return;
    }
};

// Convert encoded space in URL to a normal space.
export const decodeSpace = (str) => {
    return str.replace("%20", " ");
};

// Reduce nested objects into a single-depth object to be used for search feature.
export const flattenObj = (obj) => {
    let resultObj = {};

    for (const key in obj) {
        if (key === "__typename" || key === "_id") {
            continue;
        }
        else if ((typeof obj[key]) === "object") {
            const nestedObj = flattenObj(obj[key]);
            for (const subKey in nestedObj) {
                resultObj[key + '.' + subKey] = nestedObj[subKey];
            }
        }
        else {
            if ((typeof obj[key]) === "string") {
                if (obj[key].includes(" ")) {
                    for (let i = 0; i < obj[key].split(" ").length; i++) {
                        resultObj[key + '.' + i] = obj[key].toLowerCase().split(" ")[i];
                    }
                }
                resultObj[key] = obj[key].toLowerCase();
            }
        }
    }

    return resultObj;
};