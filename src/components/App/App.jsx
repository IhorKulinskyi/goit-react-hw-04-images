import { useState, useEffect, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

import fetchImages from 'services/fetchImages';
import SearchBar from 'components/Searchbar';
import ImageGallery from 'components/ImageGallery';
import Button from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [endOfSearch, setEndOfSearch] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentImageDescr, setCurrentImageDescr] = useState('');

  const notInitialRender = useRef(false);

  useEffect(() => {
    if (!notInitialRender || !searchQuery) {
      return;
    }
    const onSearch = async () => {
      setImages(s => [...s]);
      setLoading(true);
      const res = await fetchImages(searchQuery, page);
      if (res.data.hits.length === 0) {
        setImages([]);
        setLoading(false);
        setEndOfSearch(true);
        toast.warn('No images found');
        return;
      }
      setImages(s => {
        if ([...s, ...res.data.hits].length === res.data.totalHits) {
          setEndOfSearch(true);
        }
        return [...s, ...res.data.hits];
      });
      setLoading(false);
      setEndOfSearch(false);
    };
    onSearch();
  }, [searchQuery, page]);

  const toggleModal = () => {
    setShowModal(s => !s);
  };

  const openModal = (image, descr) => {
    setCurrentImage(image);
    setCurrentImageDescr(descr);
    toggleModal();
  };

  const onHandleSubmit = query => {
    if (query === searchQuery) {
      return;
    }
    setSearchQuery(query);
    setPage(1);
    setImages([]);
    setLoading(true);
  };

  const onLoadMore = () => {
    setPage(s => s + 1);
  };

  return (
    <div className="app">
      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={currentImage} alt={currentImageDescr} />
        </Modal>
      )}
      <SearchBar onSubmit={onHandleSubmit} />
      {<ImageGallery images={images} openModal={openModal} />}
      {loading && <Loader />}
      {!endOfSearch && <Button handleLoadMore={onLoadMore} />}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
};

export { App };
