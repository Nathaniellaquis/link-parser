import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.OpenSea;
const mod = registry.get(id)!;

describe('OpenSea tests', () => {
  const samples = {
    profile: 'https://opensea.io/artcollector',
    collection: 'https://opensea.io/collection/cool-nfts',
    asset: 'https://opensea.io/assets/ethereum/0x123abc/789',
  };

  describe('detection', () => {
    test('should detect OpenSea URLs', () => {
      Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true));
    });

    test('should not detect non-OpenSea URLs', () => {
      expect(mod.detect('https://example.com/collection/test')).toBe(false);
      expect(mod.detect('https://rarible.com/user/123')).toBe(false);
    });
  });

  describe('extraction', () => {
    test('should extract profile data', () => {
      const result = mod.extract(samples.profile);
      expect(result).not.toBeNull();
      expect(result?.username).toBe('artcollector');
      expect(result?.metadata?.isProfile).toBe(true);
      expect(result?.metadata?.contentType).toBe('profile');
    });

    test('should extract collection data', () => {
      const result = mod.extract(samples.collection);
      expect(result).not.toBeNull();
      expect(result?.ids?.collectionName).toBe('cool-nfts');
      expect(result?.metadata?.isCollection).toBe(true);
      expect(result?.metadata?.contentType).toBe('collection');
    });

    test('should extract asset data', () => {
      const result = mod.extract(samples.asset);
      expect(result).not.toBeNull();
      expect(result?.ids?.chain).toBe('ethereum');
      expect(result?.ids?.contract).toBe('0x123abc');
      expect(result?.ids?.tokenId).toBe('789');
      expect(result?.metadata?.isAsset).toBe(true);
      expect(result?.metadata?.contentType).toBe('asset');
      expect(result?.metadata?.isProduct).toBe(true);
    });

    test('should return null for non-matching URLs', () => {
      expect(mod.extract('https://opensea.io')).toBeNull();
      expect(mod.extract('https://opensea.io/invalid')).toBeNull();
    });
  });

  describe('parsing', () => {
    test('profile parse', () => {
      const r = parse(samples.profile);
      expect(r.username).toBe('artcollector');
      expect(r.metadata.isProfile).toBe(true);
    });
    test('collection parse', () => {
      const r = parse(samples.collection);
      expect(r.ids.collectionName).toBe('cool-nfts');
      expect(r.metadata.isCollection).toBe(true);
    });
    test('asset parse', () => {
      const r = parse(samples.asset);
      expect(r.ids.chain).toBe('ethereum');
      expect(r.ids.contract).toBe('0x123abc');
      expect(r.ids.tokenId).toBe('789');
      expect(r.metadata.isAsset).toBe(true);
    });
  });
});
