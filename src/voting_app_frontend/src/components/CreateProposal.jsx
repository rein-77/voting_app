import React, { useState } from 'react';

const CreateProposal = ({ onCreateProposal, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    options: ['', '']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        options: newOptions
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.title.trim()) {
      alert('Judul proposal tidak boleh kosong');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Deskripsi proposal tidak boleh kosong');
      return;
    }
    
    const validOptions = formData.options.filter(option => option.trim());
    if (validOptions.length < 2) {
      alert('Minimal harus ada 2 opsi yang valid');
      return;
    }
    
    try {
      await onCreateProposal(formData.title, formData.description, validOptions);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        options: ['', '']
      });
      
      alert('Proposal berhasil dibuat!');
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Gagal membuat proposal. Silakan coba lagi.');
    }
  };

  return (
    <div className="container">
      <div className="card create-proposal fade-in">
        <h2 className="mb-3">🗳️ Buat Proposal Baru</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Judul Proposal</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Contoh: Nanas di atas pizza?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Deskripsi</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Jelaskan detail proposal Anda..."
              required
            />
          </div>

          <div className="form-group">
            <label>Opsi Voting</label>
            <div className="option-inputs">
              {formData.options.map((option, index) => (
                <div key={index} className="option-input">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Opsi ${index + 1}`}
                    required
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      title="Hapus opsi"
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
              
              {formData.options.length < 6 && (
                <div className="add-option" onClick={addOption}>
                  <span>➕ Tambah Opsi</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Membuat Proposal...' : '🚀 Buat Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProposal;
