const DEFAULT_IMAGE = '/assets/cat-sneakers.png';

export const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
}).format(Number(value || 0));

export const getImageUrl = (product) => {
  const firstImage = product?.images?.[0];

  if (!firstImage) {
    return DEFAULT_IMAGE;
  }

  if (firstImage.startsWith('http') || firstImage.startsWith('data:')) {
    return firstImage;
  }

  const backendBaseUrl = 'http://localhost:3000';
  return firstImage.startsWith('/') ? `${backendBaseUrl}${firstImage}` : `${backendBaseUrl}/${firstImage}`;
};

export const normalizeText = (value) => String(value || '').trim().toLowerCase();
