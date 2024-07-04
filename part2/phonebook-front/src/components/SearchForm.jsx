const SearchForm = ({ searchPerson }) => {
  return (
    <form onSubmit={searchPerson}>
      filter by name: <input />
      <button type="submit">filter</button> <div className="searchedName"></div>
    </form>
  );
};

export default SearchForm;
