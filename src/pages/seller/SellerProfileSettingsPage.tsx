import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Home, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import {
  DEFAULT_SELLER_PROFILE,
  DEMO_SELLER_PROFILE_SLUG,
  SellerStoreProfile,
  loadSellerStoreProfile,
  saveSellerStoreProfile,
} from '../../lib/sellerProfile';
import styles from './SellerProfileSettingsPage.module.css';

const COUNTRIES = ['Sweden', 'Belgium', 'France', 'Germany', 'Italy', 'Spain', 'Netherlands', 'Denmark', 'Norway', 'Finland'];

const splitList = (value: string) =>
  value.split(',').map((item) => item.trim()).filter(Boolean);

const SellerProfileSettingsPage = () => {
  const [profile, setProfile] = useState<SellerStoreProfile>(() => loadSellerStoreProfile());
  const [saved, setSaved] = useState(false);

  const publicProfilePath = `/chocolatiers/${DEMO_SELLER_PROFILE_SLUG}`;

  const completionItems = useMemo(
    () => [
      Boolean(profile.storeName),
      Boolean(profile.tagline),
      Boolean(profile.story),
      Boolean(profile.country && profile.city),
      profile.specialties.length > 0,
      Boolean(profile.shippingInfo),
    ],
    [profile],
  );
  const completion = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100);

  const updateField = <K extends keyof SellerStoreProfile>(field: K, value: SellerStoreProfile[K]) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    saveSellerStoreProfile(profile);
    setSaved(true);
  };

  const resetDemo = () => {
    setProfile(DEFAULT_SELLER_PROFILE);
    saveSellerStoreProfile(DEFAULT_SELLER_PROFILE);
    setSaved(true);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Store profile</p>
          <h1 className={styles.title}>Shape your public chocolatier page</h1>
          <p className={styles.subtitle}>
            This information powers the profile customers see when they discover your store on Chocolata.
          </p>
        </div>
        <div className={styles.heroActions}>
          <Link to={publicProfilePath}>
            <Button type="button" variant="outline"><Eye size={16} /> Preview public profile</Button>
          </Link>
          <Link to="/">
            <Button type="button" variant="ghost"><Home size={16} /> View marketplace</Button>
          </Link>
        </div>
      </section>

      {saved && <div className={styles.success}>Profile saved. Open preview to see it as customers do.</div>}

      <section className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Profile basics</h2>
            <span>{completion}% complete</span>
          </div>
          <Input label="Store/chocolatier name" value={profile.storeName} onChange={(event) => updateField('storeName', event.target.value)} />
          <Input label="Short tagline" value={profile.tagline} onChange={(event) => updateField('tagline', event.target.value)} />
          <div className={styles.row}>
            <Select
              label="Country"
              value={profile.country}
              options={COUNTRIES.map((country) => ({ value: country, label: country }))}
              onChange={(event) => updateField('country', event.target.value)}
            />
            <Input label="City" value={profile.city} onChange={(event) => updateField('city', event.target.value)} />
          </div>
          <label className={styles.label}>
            Full profile story/about text
            <textarea value={profile.story} onChange={(event) => updateField('story', event.target.value)} rows={7} />
          </label>
        </div>

        <div className={styles.card}>
          <h2>Craft and positioning</h2>
          <Input
            label="Specialties"
            helperText="Separate with commas"
            value={profile.specialties.join(', ')}
            onChange={(event) => updateField('specialties', splitList(event.target.value))}
          />
          <Input
            label="Signature products"
            helperText="Separate with commas"
            value={profile.signatureProducts.join(', ')}
            onChange={(event) => updateField('signatureProducts', splitList(event.target.value))}
          />
          <label className={styles.label}>
            Sustainability text
            <textarea value={profile.sustainability} onChange={(event) => updateField('sustainability', event.target.value)} rows={5} />
          </label>
        </div>

        <div className={styles.card}>
          <h2>Shipping and packaging</h2>
          <Input label="Shipping information" value={profile.shippingInfo} onChange={(event) => updateField('shippingInfo', event.target.value)} />
          <Input label="Delivery estimate" helperText="Example: 2-5" value={profile.deliveryEstimate} onChange={(event) => updateField('deliveryEstimate', event.target.value)} />
          <Input
            label="Packaging options"
            helperText="Separate with commas"
            value={profile.packagingOptions.join(', ')}
            onChange={(event) => updateField('packagingOptions', splitList(event.target.value))}
          />
          <div className={styles.toggles}>
            {[
              ['heatProtection', 'Heat protection available'],
              ['giftPackaging', 'Gift packaging available'],
              ['summerShipping', 'Summer shipping available'],
              ['ecoPackaging', 'Eco packaging available'],
            ].map(([field, label]) => (
              <label key={field} className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={Boolean(profile[field as keyof SellerStoreProfile])}
                  onChange={(event) => updateField(field as keyof SellerStoreProfile, event.target.checked as never)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h2>Images</h2>
          <Input label="Logo/profile image URL" value={profile.logoImage} onChange={(event) => updateField('logoImage', event.target.value)} />
          <Input label="Cover/hero image URL" value={profile.coverImage} onChange={(event) => updateField('coverImage', event.target.value)} />
          <Input
            label="Gallery image URLs"
            helperText="Separate with commas"
            value={profile.galleryImages.join(', ')}
            onChange={(event) => updateField('galleryImages', splitList(event.target.value))}
          />
        </div>
      </section>

      <div className={styles.footerActions}>
        <Button type="button" variant="ghost" onClick={resetDemo}>Reset demo profile</Button>
        <Button type="submit" variant="gold"><Save size={16} /> Save store profile</Button>
      </div>
    </form>
  );
};

export default SellerProfileSettingsPage;
