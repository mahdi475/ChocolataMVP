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
import { IMAGE_MAX_SIZE_MB, isAcceptedImageSize, isAcceptedImageType } from '../../lib/imageUploadLimits';
import styles from './SellerProfileSettingsPage.module.css';

const MAX_PROFILE_GALLERY_IMAGES = 10;

const splitList = (value: string) =>
  value.split(',').map((item) => item.trim()).filter(Boolean);

const readImageFile = (file: File, onLoad: (url: string) => void, onError: (message: string) => void, t: ReturnType<typeof useTranslation>['t']) => {
  if (!isAcceptedImageType(file)) {
    onError(t('imageUpload.invalidType'));
    return;
  }
  if (!isAcceptedImageSize(file)) {
    onError(t('imageUpload.fileTooLarge', { size: IMAGE_MAX_SIZE_MB }));
    return;
  }
  const reader = new FileReader();
  reader.onload = () => onLoad(reader.result as string);
  reader.readAsDataURL(file);
};

const SellerProfileSettingsPage = () => {
  const { t } = useTranslation('ui');
  const [profile, setProfile] = useState<SellerStoreProfile>(() => loadSellerStoreProfile());
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [galleryError, setGalleryError] = useState('');

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
    setSaveMessage('');
    setSaveError('');
  };

  const appendGalleryImage = (url: string) => {
    setProfile((current) => {
      if (current.galleryImages.length >= MAX_PROFILE_GALLERY_IMAGES) {
        setGalleryError(t('upload.maxImagesAllowed', { count: MAX_PROFILE_GALLERY_IMAGES }));
        return current;
      }
      setGalleryError('');
      return { ...current, galleryImages: [...current.galleryImages, url] };
    });
    setSaveMessage('');
    setSaveError('');
  };

  const setProfileStatus = (status: SellerStoreProfile['status']) => {
    if (status === 'offline' && !window.confirm(t('sellerProfile.offlineWarning'))) return;
    updateField('status', status);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      saveSellerStoreProfile(profile);
      setSaveMessage(t('sellerProfile.savedSuccessfully'));
      setSaveError('');
      window.setTimeout(() => setSaveMessage(''), 3500);
    } catch {
      setSaveMessage('');
      setSaveError(t('sellerProfile.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const resetDemo = () => {
    setProfile(DEFAULT_SELLER_PROFILE);
    try {
      saveSellerStoreProfile(DEFAULT_SELLER_PROFILE);
      setSaveMessage(t('sellerProfile.savedSuccessfully'));
      setSaveError('');
    } catch {
      setSaveMessage('');
      setSaveError(t('sellerProfile.saveFailed'));
    }
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
                if (file) readImageFile(file, (url) => updateField('logoImage', url), setSaveError, t);
              }} />
              {profile.logoImage && <button type="button" onClick={() => updateField('logoImage', '')}>{t('sellerProfile.removeLogo')}</button>}
            </label>
            <label className={styles.imagePicker}>
              <span>{t('sellerProfile.coverImage')}</span>
              {profile.coverImage ? <img src={profile.coverImage} alt="" /> : <strong>{t('sellerProfile.noCover')}</strong>}
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) readImageFile(file, (url) => updateField('coverImage', url), setSaveError, t);
              }} />
              {profile.coverImage && <button type="button" onClick={() => updateField('coverImage', '')}>{t('sellerProfile.removeCover')}</button>}
            </label>
          </div>
        </div>

        <div className={styles.card}>
          <h2>{t('sellerProfile.photoAlbum')}</h2>
          <p className={styles.helperText}>{t('sellerProfile.photoAlbumHelper')}</p>
          <p className={styles.helperText}>{t('upload.upToImages', { count: MAX_PROFILE_GALLERY_IMAGES })}</p>
          {galleryError && <div className={styles.error}>{galleryError}</div>}
          <label className={styles.label}>
            {t('sellerProfile.galleryImages')}
            <input type="file" accept="image/png,image/jpeg,image/webp" multiple disabled={profile.galleryImages.length >= MAX_PROFILE_GALLERY_IMAGES} onChange={(event) => {
              const files = Array.from(event.target.files || []);
              const availableSlots = MAX_PROFILE_GALLERY_IMAGES - profile.galleryImages.length;
              if (files.length > availableSlots) {
                setGalleryError(t('upload.maxImagesAllowed', { count: MAX_PROFILE_GALLERY_IMAGES }));
              }
              files.slice(0, Math.max(availableSlots, 0)).forEach((file) => {
                readImageFile(file, appendGalleryImage, setGalleryError, t);
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
        <Button type="submit" variant="gold" isLoading={isSaving}><Save size={16} /> {t('sellerProfile.save')}</Button>
        <span className={`${styles.saveFeedback} ${saveError ? styles.saveFeedbackError : ''}`}>
          {isSaving ? t('sellerProfile.saving') : saveError || saveMessage}
        </span>
      </div>
    </form>
  );
};

export default SellerProfileSettingsPage;
