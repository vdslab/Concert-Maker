class MyConcert {
  /**
   * Creates a new concert with the given name and stores it in the local storage.
   * If a concert with the same name already exists, it returns -1.
   *
   * @param {string} name - The name of the concert.
   * @returns {number} - Returns -1 if a concert with the same name already exists, otherwise undefined.
   */
  static createConcert(name) {
    const myConcerts = JSON.parse(localStorage.getItem("MyConcerts")) || [];
    if (myConcerts.find((concert) => concert.name === name)) {
      return -1;
    }
    const newConcert = {
      name,
      works: [],
    };
    myConcerts.push(newConcert);
    localStorage.setItem("MyConcerts", JSON.stringify(myConcerts));
  }

  /**
   * Saves a work to a concert. If the work already exists in the concert, it does not add it again.
   *
   * @param {number} workId - The ID of the work to be added.
   * @param {string} concertName - The name of the concert to which the work is to be added.
   * @returns {number} - Returns -1 if the work is already in the concert, otherwise does not return anything.
   */
  static saveWork(workId, concertName) {
    const myConcerts = JSON.parse(localStorage.getItem("MyConcerts")) || [];
    const concert = myConcerts.find((concert) => concert.name === concertName);
    if (concert.works.includes(workId)) {
      return -1;
    }
    concert.works.push(workId);
    localStorage.setItem("MyConcerts", JSON.stringify(myConcerts));
  }

  /**
   * Gets all concerts from localStorage.
   *
   * @returns {Array} - An array of concerts.
   */
  static getConcerts() {
    return JSON.parse(localStorage.getItem("MyConcerts")) || [];
  }

  /**
   * Gets a specific concert by its name.
   *
   * @param {string} name - The name of the concert to be loaded.
   * @returns {Object|null} - The concert object if found, otherwise null.
   */
  static getConcert(name) {
    const myConcerts = JSON.parse(localStorage.getItem("MyConcerts")) || [];
    return myConcerts.find((concert) => concert.name === name);
  }

  /**
   * Gets the names of all concerts.
   *
   * @returns {Array} - An array of strings containing the names of all concerts.
   */
  static getConcertNames() {
    const myConcerts = JSON.parse(localStorage.getItem("MyConcerts")) || [];
    return myConcerts.map((concert) => concert.name);
  }
}

// Export the class for use in other modules
export default MyConcert;
