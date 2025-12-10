import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import styles from './AddressSelector.module.css';

export interface Address {
  id?: string;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

interface AddressSelectorProps {
  value: Address;
  onChange: (address: Address) => void;
  onSaveAddress?: (address: Address) => void;
}

const AddressSelector = ({ value, onChange, onSaveAddress }: AddressSelectorProps) => {
  const { user } = useAuth();
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSavedAddresses();
    }
  }, [user]);

  const fetchSavedAddresses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedAddresses(data || []);
      
      // Set default address if available and no address is selected
      if (data && data.length > 0 && (!value.full_name || !value.address_line1)) {
        const defaultAddress = data.find(addr => addr.is_default) || data[0];
        onChange({
          full_name: defaultAddress.full_name,
          address_line1: defaultAddress.address_line1,
          address_line2: defaultAddress.address_line2 || '',
          city: defaultAddress.city,
          postal_code: defaultAddress.postal_code,
          country: defaultAddress.country,
        });
      }
    } catch (err) {
      console.error('Failed to load saved addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address: Address) => {
    onChange({
      full_name: address.full_name,
      address_line1: address.address_line1,
      address_line2: address.address_line2,
      city: address.city,
      postal_code: address.postal_code,
      country: address.country,
    });
    setShowNewAddress(false);
  };

  const handleSaveNewAddress = async () => {
    if (!user || !saveAddress) return;
    
    try {
      const { error } = await supabase
        .from('user_addresses')
        .insert({
          user_id: user.id,
          full_name: value.full_name,
          address_line1: value.address_line1,
          address_line2: value.address_line2 || null,
          city: value.city,
          postal_code: value.postal_code,
          country: value.country,
          is_default: savedAddresses.length === 0, // First address is default
        });

      if (error) throw error;
      await fetchSavedAddresses();
      setSaveAddress(false);
      if (onSaveAddress) {
        onSaveAddress(value);
      }
    } catch (err: any) {
      console.error('Failed to save address:', err);
    }
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <LoadingSpinner />
      ) : savedAddresses.length > 0 && !showNewAddress ? (
        <div className={styles.savedAddresses}>
          <div className={styles.header}>
            <h3>Saved Addresses</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNewAddress(true)}
            >
              + New Address
            </Button>
          </div>
          <div className={styles.addressList}>
            {savedAddresses.map((address) => (
              <Card
                key={address.id}
                className={`${styles.addressCard} ${
                  value.address_line1 === address.address_line1 &&
                  value.postal_code === address.postal_code
                    ? styles.selected
                    : ''
                }`}
                onClick={() => handleAddressSelect(address)}
              >
                <div className={styles.addressContent}>
                  <div className={styles.addressHeader}>
                    <strong>{address.full_name}</strong>
                    {address.is_default && (
                      <span className={styles.defaultBadge}>Default</span>
                    )}
                  </div>
                  <p className={styles.addressText}>
                    {address.address_line1}
                    {address.address_line2 && `, ${address.address_line2}`}
                    <br />
                    {address.city}, {address.postal_code}
                    <br />
                    {address.country}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.newAddress}>
          {savedAddresses.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNewAddress(false)}
              className={styles.backButton}
            >
              ← Use Saved Address
            </Button>
          )}
          {user && (
            <label className={styles.saveCheckbox}>
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
              />
              <span>Save this address for future orders</span>
            </label>
          )}
          {saveAddress && user && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveNewAddress}
              className={styles.saveButton}
            >
              Save Address
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressSelector;

