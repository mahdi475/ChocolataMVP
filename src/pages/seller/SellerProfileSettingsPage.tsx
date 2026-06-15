import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, Home, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { countrySelectOptions } from '../../lib/marketplaceCountries';
import {
  DEFAULT_SELLER_PROFILE,
  DEMO_SELLER_PROFILE_SLUG,
  SellerStoreProfile,
  loadSellerStoreProfile,
  saveSellerStoreProfile,
} from '../../lib/sellerProfile';
import styles from './SellerProfileSettingsPage.module.css';

const splitList = (value: string) =>
  value.split(',').map((item) => item.trim()).filter(Boolean);

const readImageFile = (file: File, onLoad: (url: string) => void) => {
  if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return;
  const reader = new FileReader();
  reader.onload = () => onLoad(reader.result as string);
  reader.readAsDataURL(file);
};

const SellerProfileSettingsPage = () => {
  const { t } = useTranslation('ui');
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

  const appendGalleryImage = (url: string) => {
    setProfile((current) => ({ ...current, galleryImages: [...current.galleryImages, url] }));
    setSaved(false);
  };

  const setProfileStatus = (status: SellerStoreProfile['status']) => {
    if (status === 'offline' && !window.confirm(t('sellerProfile.offlineWarning'))) return;
    updateField('status', status);
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
          <p className={styles.eyebrow}>{t('sellerProfile.eyebrow')}</p>
          <h1 className={styles.title}>{t('sellerProfile.title')}</h1>
          <p className={styles.subtitle}>
            {t('sellerProfile.subtitle')}
          </p>
        </div>
        <div className={styles.heroActions}>
          <Link to={publicProfilePath}>
            <Button type="button" variant="outline"><Eye size={16} /> {t('sellerProfile.previewPublicProfile')}</Button>
          </Link>
          <Link to="/">
            <Button type="button" variant="ghost"><Home size={16} /> {t('sellerShell.viewMarketplace')}</Button>
          </Link>
        </div>
      </section>

      {saved && <div className={styles.success}>{t('sellerProfile.saved')}</div>}

      <section className={styles.statusCard}>
        <div>
          <p className={styles.eyebrow}>{t('sellerProfile.publicVisibility')}</p>
          <h2>{t('sellerProfile.profileStatus')}: {profile.status === 'live' ? t('sellerProfile.live') : t('sellerProfile.offline')}</h2>
          <p>{profile.status === 'live' ? t('sellerProfile.liveHelp') : t('sellerProfile.offlineHelp')}</p>
        </div>
        <div className={styles.statusActions}>
          <Button type="button" variant={profile.status === 'live' ? 'gold' : 'outline'} onClick={() => setProfileStatus('live')}>
            {t('sellerProfile.goLive')}
          </Button>
          <Button type="button" variant={profile.status === 'offline' ? 'gold' : 'ghost'} onClick={() => setProfileStatus('offline')}>
            {t('sellerProfile.goOffline')}
          </Button>
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>{t('sellerProfile.basics')}</h2>
            <span>{t('sellerProfile.complete', { percent: completion })}</span>
          </div>
          <Input label={t('sellerProfile.storeName')} value={profile.storeName} onChange={(event) => updateField('storeName', event.target.value)} />
          <Input label={t('sellerProfile.tagline')} value={profile.tagline} onChange={(event) => updateField('tagline', event.target.value)} />
          <div className={styles.row}>
            <Select
              label={t('sellerProfile.country')}
              value={profile.country}
              options={countrySelectOptions()}
              onChange={(event) => updateField('country', event.target.value)}
            />
            <Input label={t('sellerProfile.city')} value={profile.city} onChange={(event) => updateField('city', event.target.value)} />
          </div>
          <label className={styles.label}>
            {t('sellerProfile.story')}
            <textarea value={profile.story} onChange={(event) => updateField('story', event.target.value)} rows={7} />
          </label>
        </div>

        <div className={styles.card}>
          <h2>{t('sellerProfile.craft')}</h2>
          <Input
            label={t('sellerProfile.specialties')}
            helperText={t('sellerProfile.commaHelper')}
            value={profile.specialties.join(', ')}
            onChange={(event) => updateField('specialties', splitList(event.target.value))}
          />
          <Input
            label={t('sellerProfile.signatureProducts')}
            helperText={t('sellerProfile.commaHelper')}
            value={profile.signatureProducts.join(', ')}
            onChange={(event) => updateField('signatureProducts', splitList(event.target.value))}
          />
          <label className={styles.label}>
            {t('sellerProfile.sustainability')}
            <textarea value={profile.sustainability} onChange={(event) => updateField('sustainability', event.target.value)} rows={5} />
          </label>
        </div>

        <div className={styles.card}>
          <h2>{t('sellerProfile.shippingPackaging')}</h2>
          <Input label={t('sellerProfile.shippingInfo')} value={profile.shippingInfo} onChange={(event) => updateField('shippingInfo', event.target.value)} />
          <Input label={t('sellerProfile.deliveryEstimate')} helperText={t('sellerProfile.deliveryHelper')} value={profile.deliveryEstimate} onChange={(event) => updateField('deliveryEstimate', event.target.value)} />
          <Input
            label={t('sellerProfile.packagingOptions')}
            helperText={t('sellerProfile.commaHelper')}
            value={profile.packagingOptions.join(', ')}
            onChange={(event) => updateField('packagingOptions', splitList(event.target.value))}
          />
          <div className={styles.toggles}>
            {[
              ['heatProtection', t('shippingPackaging.heatProtectionAvailable')],
              ['giftPackaging', t('shippingPackaging.giftPackagingAvailable')],
              ['summerShipping', t('shippingPackaging.summerShippingAvailable')],
              ['ecoPackaging', t('shippingPackaging.ecoPackagingAvailable')],
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
          <h2>{t('sellerProfile.storeIdentity')}</h2>
          <div className={styles.imageUploadGrid}>
            <label className={styles.imagePicker}>
              <span>{t('sellerProfile.logoImage')}</span>
              <small>{t('sellerProfile.logoHelper')}</small>
              {profile.logoImage ? <img src={profile.logoImage} alt="" /> : <strong>{t('sellerProfile.noLogo')}</strong>}
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) readImageFile(file, (url) => updateField('logoImage', url));
              }} />
              {profile.logoImage && <button type="button" onClick={() => updateField('logoImage', '')}>{t('sellerProfile.removeLogo')}</button>}
            </label>
            <label className={styles.imagePicker}>
              <span>{t('sellerProfile.coverImage')}</span>
              {profile.coverImage ? <img src={profile.coverImage} alt="" /> : <strong>{t('sellerProfile.noCover')}</strong>}
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) readImageFile(file, (url) => updateField('coverImage', url));
              }} />
              {profile.coverImage && <button type="button" onClick={() => updateField('coverImage', '')}>{t('sellerProfile.removeCover')}</button>}
            </label>
          </div>
        </div>

        <div className={styles.card}>
          <h2>{t('sellerProfile.photoAlbum')}</h2>
          <p className={styles.helperText}>{t('sellerProfile.photoAlbumHelper')}</p>
          <label className={styles.label}>
            {t('sellerProfile.galleryImages')}
            <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={(event) => {
              Array.from(event.target.files || []).forEach((file) => {
                readImageFile(file, appendGalleryImage);
              });
              event.currentTarget.value = '';
            }} />
          </label>
          <div className={styles.galleryGrid}>
            {profile.galleryImages.map((image, index) => (
              <div className={styles.galleryItem} key={`${image}-${index}`}>
                <img src={image} alt="" />
                <button type="button" onClick={() => updateField('galleryImages', profile.galleryImages.filter((_, i) => i !== index))}>{t('sellerProfile.removeImage')}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.footerActions}>
        <Button type="button" variant="ghost" onClick={resetDemo}>{t('sellerProfile.resetDemo')}</Button>
        <Button type="submit" variant="gold"><Save size={16} /> {t('sellerProfile.save')}</Button>
      </div>
    </form>
  );
};

export default SellerProfileSettingsPage;
