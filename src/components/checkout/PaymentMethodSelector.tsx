import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';
import styles from './PaymentMethodSelector.module.css';
import visaLogo from '../../pages/assets/Version=Logo.jpg';
import mastercardLogo from '../../pages/assets/Version=ID Check.jpg';
import klarnaLogo from '../../pages/assets/Klarna.jpg';
import paypalLogo from '../../pages/assets/Paypal.jpg';

export type PaymentMethod = 'card' | 'klarna' | 'paypal';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const PaymentMethodSelector = ({ value, onChange }: PaymentMethodSelectorProps) => {
  const { t } = useTranslation('ui');
  const methods: { 
    id: PaymentMethod; 
    name: string; 
    icon: string | React.ReactNode; 
    description: string;
    isImage?: boolean;
  }[] = [
    {
      id: 'card',
      name: t('checkout.cardName'),
      icon: (
        <div className={styles.cardLogos}>
          <img src={visaLogo} alt="Visa" className={styles.paymentLogo} />
          <img src={mastercardLogo} alt="Mastercard" className={styles.paymentLogo} />
        </div>
      ),
      description: t('checkout.cardDescription'),
      isImage: true,
    },
    {
      id: 'klarna',
      name: 'Klarna',
      icon: <img src={klarnaLogo} alt="Klarna" className={styles.paymentLogo} />,
      description: t('checkout.klarnaDescription'),
      isImage: true,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <img src={paypalLogo} alt="PayPal" className={styles.paymentLogo} />,
      description: t('checkout.paypalDescription'),
      isImage: true,
    },
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('checkout.paymentMethod')}</h3>
      <div className={styles.methods}>
        {methods.map((method) => (
          <Card
            key={method.id}
            className={`${styles.methodCard} ${
              value === method.id ? styles.selected : ''
            }`}
            onClick={() => onChange(method.id)}
          >
            <div className={styles.methodContent}>
              <div className={styles.icon}>{method.icon}</div>
              <div className={styles.methodInfo}>
                <strong className={styles.methodName}>{method.name}</strong>
                <span className={styles.methodDescription}>{method.description}</span>
              </div>
              <div className={styles.radio}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={value === method.id}
                  onChange={() => onChange(method.id)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;

