import { useState } from 'react';
import { toast } from 'react-toastify';
import { IconContext } from 'react-icons';
import { AiOutlineSearch } from 'react-icons/ai';
import PropTypes from 'prop-types';

import './Searchbar.scss';

const SearchBar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleChange = e => {
    const { value } = e.target;
    setQuery(value.toLowerCase().trim());
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (query.trim() === '') {
      toast.error('Empty search input');
      return;
    }
    onSubmit(query);
  };

  return (
    <header className="searchbar">
      <form className="searchForm" onSubmit={handleSubmit}>
        <button type="submit" className="searchForm-button">
          <IconContext.Provider value={{ className: 'search-icon' }}>
            <AiOutlineSearch />
          </IconContext.Provider>
          <span className="searchForm-button-label">Search</span>
        </button>

        <input
          name="search"
          onChange={handleChange}
          value={query}
          className="searchForm-input"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
