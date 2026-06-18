export type SellerVerificationStatus = 'pending_verification' | 'verified' | 'rejected' | 'suspended';
export type SellerProfileStatus = 'live' | 'offline';
export type ProductPublicationStatus = 'draft' | 'published' | 'archived' | 'out_of_stock';

export const normalizeSellerVerificationStatus = (status?: string | null): SellerVerificationStatus => {
  switch (status) {
    case 'approved':
    case 'verified':
      return 'verified';
    case 'rejected':
      return 'rejected';
    case 'suspended':
      return 'suspended';
    case 'pending':
    case 'pending_verification':
    default:
      return 'pending_verification';
  }
};

export const sellerVerificationStatusForStorage = (status: SellerVerificationStatus) => {
  if (status === 'verified') return 'approved';
  if (status === 'pending_verification') return 'pending';
  return status;
};

export const normalizeProfileStatus = (status?: string | null): SellerProfileStatus =>
  status === 'offline' ? 'offline' : 'live';

export const normalizeProductStatus = (
  product: { status?: string | null; is_active?: boolean | null; stock?: number | null },
): ProductPublicationStatus => {
  if (product.status === 'archived') return 'archived';
  if (product.status === 'out_of_stock') return 'out_of_stock';
  if (product.status === 'draft') return 'draft';
  if (product.status === 'published') return 'published';
  if (product.is_active === false) return 'draft';
  return 'published';
};

export const isSellerVerified = (status?: string | null) =>
  normalizeSellerVerificationStatus(status) === 'verified';

export const isSellerPublic = (seller: { verificationStatus?: string | null; status?: string | null }) =>
  isSellerVerified(seller.verificationStatus) && normalizeProfileStatus(seller.status) === 'live';

export const isProductPublished = (
  product: { status?: string | null; is_active?: boolean | null; stock?: number | null },
) => normalizeProductStatus(product) === 'published';

export const isProductPublic = (
  product: { status?: string | null; is_active?: boolean | null; stock?: number | null },
  seller: { verificationStatus?: string | null; status?: string | null },
) => isSellerPublic(seller) && isProductPublished(product);

export const sellerStatusMessageKey = (seller: { verificationStatus?: string | null; status?: string | null }) => {
  const verificationStatus = normalizeSellerVerificationStatus(seller.verificationStatus);
  if (verificationStatus === 'pending_verification') return 'sellerProfile.pendingVerificationMessage';
  if (verificationStatus === 'verified' && normalizeProfileStatus(seller.status) === 'live') return 'sellerProfile.liveMessage';
  if (verificationStatus === 'verified') return 'sellerProfile.verifiedMessage';
  if (verificationStatus === 'rejected') return 'sellerProfile.rejectedMessage';
  if (verificationStatus === 'suspended') return 'sellerProfile.suspendedMessage';
  return 'sellerProfile.offlineMessage';
};
