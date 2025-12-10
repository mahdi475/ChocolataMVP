import { useState } from 'react';
import Card from '../ui/Card';
import styles from './PaymentMethodSelector.module.css';

export type PaymentMethod = 'card' | 'klarna' | 'paypal';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const PaymentMethodSelector = ({ value, onChange }: PaymentMethodSelectorProps) => {
  const methods: { id: PaymentMethod; name: string; icon: string; description: string }[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, Amex',
    },
    {
      id: 'klarna',
      name: 'Klarna',
      icon: '🛒',
      description: 'Pay later or in installments',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🔵',
      description: 'Pay with your PayPal account',
    },
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Payment Method</h3>
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
              <span className={styles.icon}>{method.icon}</span>
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

