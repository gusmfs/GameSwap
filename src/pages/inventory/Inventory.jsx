import React, { useState, useEffect } from 'react';
import { FaSpinner, FaExclamationTriangle, FaPlus } from 'react-icons/fa';
import InventoryItemCard from '../../components/inventory/InventoryItemCard';
import { 
  fetchInventoryItems, 
  addInventoryItem, 
  updateInventoryItem, 
  removeInventoryItem, 
  markItemAsSold,
  getInventoryStats 
} from '../../services/inventoryApi';
import './Inventory.css';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalSold: 0,
    totalEarnings: 0,
    activeItems: 0
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    weapon: { name: '' },
    rarity: { name: '' },
    wear: { name: '' },
    price: '',
    image: '',
    stattrak: false
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const inventoryItems = await fetchInventoryItems();
      const inventoryStats = await getInventoryStats();
      setItems(inventoryItems);
      setStats(inventoryStats);
    } catch (err) {
      setError('Erro ao carregar inventário. Tente novamente.');
      console.error('Erro ao carregar inventário:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const newItem = await addInventoryItem(formData);
      setItems(prevItems => [newItem, ...prevItems]);
      setFormData({
        name: '',
        weapon: { name: '' },
        rarity: { name: '' },
        wear: { name: '' },
        price: '',
        image: '',
        stattrak: false
      });
      setIsAddModalOpen(false);
      loadInventory(); // Recarregar para atualizar estatísticas
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
    }
  };

  const handleEditItem = async (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsAddModalOpen(true);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      await updateInventoryItem(editingItem.id, formData);
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === editingItem.id ? { ...item, ...formData } : item
        )
      );
      setFormData({
        name: '',
        weapon: { name: '' },
        rarity: { name: '' },
        wear: { name: '' },
        price: '',
        image: '',
        stattrak: false
      });
      setEditingItem(null);
      setIsAddModalOpen(false);
      loadInventory(); // Recarregar para atualizar estatísticas
    } catch (err) {
      console.error('Erro ao atualizar item:', err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Tem certeza que deseja remover este item?')) {
      try {
        await removeInventoryItem(itemId);
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        loadInventory(); // Recarregar para atualizar estatísticas
      } catch (err) {
        console.error('Erro ao remover item:', err);
      }
    }
  };

  const handleMarkAsSold = async (itemId) => {
    try {
      await markItemAsSold(itemId);
      loadInventory(); // Recarregar itens e estatísticas
    } catch (err) {
      console.error('Erro ao marcar item como vendido:', err);
    }
  };

  const activeItems = items.filter(item => item.status === 'active');
  const soldItems = items.filter(item => item.status === 'sold');

  return (
    <main className="inventory">
      <div className="animated-background">
        <div className="blur-circle circle1"></div>
        <div className="blur-circle circle2"></div>
        <div className="blur-circle circle3"></div>
        <div className="blur-circle circle4"></div>
      </div>

      <div className="inventory-container">
        <div className="inventory-header">
          <h1 className="inventory-title">
            Meu Inventário
          </h1>
          <p className="inventory-subtitle">
            Gerencie suas skins e acompanhe suas vendas
          </p>
        </div>

        <div className="inventory-stats">
          <div className="stat-card">
            <h3>Itens Ativos</h3>
            <p>{stats.activeItems}</p>
          </div>
          <div className="stat-card">
            <h3>Itens Vendidos</h3>
            <p>{stats.totalSold}</p>
          </div>
          <div className="stat-card">
            <h3>Ganhos Totais</h3>
            <p>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(stats.totalEarnings)}
            </p>
          </div>
        </div>

        <div className="inventory-content">
          <div className="section-header">
            <h2>Itens Ativos</h2>
            <button 
              className="add-item-button"
              onClick={() => setIsAddModalOpen(true)}
            >
              <FaPlus /> Adicionar Item
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <FaSpinner className="loading-spinner" />
              <p>Carregando inventário...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <FaExclamationTriangle className="error-icon" />
              <h3>Ops! Algo deu errado</h3>
              <p>{error}</p>
              <button onClick={loadInventory} className="retry-button">
                Tentar Novamente
              </button>
            </div>
          ) : activeItems.length === 0 ? (
            <div className="empty-state">
              <h3>Nenhum item ativo</h3>
              <p>Adicione itens ao seu inventário para começar a vender</p>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="add-item-button"
              >
                <FaPlus /> Adicionar Primeiro Item
              </button>
            </div>
          ) : (
            <div className="items-grid">
              {activeItems.map(item => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                  onMarkAsSold={handleMarkAsSold}
                />
              ))}
            </div>
          )}

          {soldItems.length > 0 && (
            <div className="sold-items-section">
              <h2>Itens Vendidos</h2>
              <div className="items-grid">
                {soldItems.map(item => (
                  <InventoryItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    onMarkAsSold={handleMarkAsSold}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Adicionar/Editar Item */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingItem ? 'Editar Item' : 'Adicionar Novo Item'}</h2>
            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem}>
              <div className="form-group">
                <label htmlFor="name">Nome do Item</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="weapon">Arma</label>
                <input
                  type="text"
                  id="weapon"
                  value={formData.weapon.name}
                  onChange={e => setFormData({ 
                    ...formData, 
                    weapon: { name: e.target.value } 
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="rarity">Raridade</label>
                <select
                  id="rarity"
                  value={formData.rarity.name}
                  onChange={e => setFormData({ 
                    ...formData, 
                    rarity: { name: e.target.value } 
                  })}
                  required
                >
                  <option value="">Selecione a raridade</option>
                  <option value="Consumer Grade">Consumer Grade</option>
                  <option value="Industrial Grade">Industrial Grade</option>
                  <option value="Mil-Spec Grade">Mil-Spec Grade</option>
                  <option value="Restricted">Restricted</option>
                  <option value="Classified">Classified</option>
                  <option value="Covert">Covert</option>
                  <option value="Contraband">Contraband</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="wear">Desgaste</label>
                <select
                  id="wear"
                  value={formData.wear.name}
                  onChange={e => setFormData({ 
                    ...formData, 
                    wear: { name: e.target.value } 
                  })}
                  required
                >
                  <option value="">Selecione o desgaste</option>
                  <option value="Factory New">Factory New</option>
                  <option value="Minimal Wear">Minimal Wear</option>
                  <option value="Field-Tested">Field-Tested</option>
                  <option value="Well-Worn">Well-Worn</option>
                  <option value="Battle-Scarred">Battle-Scarred</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Preço (R$)</label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">URL da Imagem</label>
                <input
                  type="url"
                  id="image"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  required
                />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.stattrak}
                    onChange={e => setFormData({ ...formData, stattrak: e.target.checked })}
                  />
                  StatTrak™
                </label>
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-button">
                  {editingItem ? 'Salvar Alterações' : 'Adicionar Item'}
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                    setFormData({
                      name: '',
                      weapon: { name: '' },
                      rarity: { name: '' },
                      wear: { name: '' },
                      price: '',
                      image: '',
                      stattrak: false
                    });
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Inventory; 