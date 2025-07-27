import { fetchCharacterBySearchString } from './fetchCharacterBySearchString';
import axios from 'axios';
describe('fetchCharacterBySearchString', () => {
  it('returns fallback on error', async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('fail'));
    const data = await fetchCharacterBySearchString('pikachu');
    expect(data).toEqual({ results: [], count: 0, previous: null, next: null });
  });

  it('returns normalized character on success', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        types: ['electric'],
        sprites: { front_default: 'img.png' },
      },
    });
    const data = await fetchCharacterBySearchString('pikachu');
    expect(data).toEqual({
      results: [
        {
          id: 25,
          name: 'pikachu',
          height: 4,
          weight: 60,
          types: ['electric'],
          image: 'img.png',
        },
      ],
      count: 1,
      previous: null,
      next: null,
    });
  });
});
