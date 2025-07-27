import { fetchCharacters } from './fetchCharacters';
import axios from 'axios';

describe('fetchCharacters', () => {
  it('returns fallback on error', async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('fail'));
    const data = await fetchCharacters(1);
    expect(data).toEqual({ results: [], count: 0, previous: null, next: null });
  });

  it('returns normalized characters on success', async () => {
    const mockList = [{ url: 'url1' }, { url: 'url2' }];
    const mockResponse = {
      data: {
        count: 2,
        next: null,
        previous: null,
        results: mockList,
      },
    };
    const mockDetails = [
      {
        data: {
          id: 1,
          name: 'bulbasaur',
          height: 7,
          weight: 69,
          types: ['grass'],
          sprites: { front_default: 'img1.png' },
        },
      },
      {
        data: {
          id: 2,
          name: 'ivysaur',
          height: 10,
          weight: 130,
          types: ['grass', 'poison'],
          sprites: { front_default: 'img2.png' },
        },
      },
    ];
    const getSpy = jest.spyOn(axios, 'get');
    getSpy.mockResolvedValueOnce(mockResponse);
    getSpy.mockResolvedValueOnce(mockDetails[0]);
    getSpy.mockResolvedValueOnce(mockDetails[1]);
    const data = await fetchCharacters(1);
    expect(data).toEqual({
      results: [
        {
          id: 1,
          name: 'bulbasaur',
          height: 7,
          weight: 69,
          types: ['grass'],
          image: 'img1.png',
        },
        {
          id: 2,
          name: 'ivysaur',
          height: 10,
          weight: 130,
          types: ['grass', 'poison'],
          image: 'img2.png',
        },
      ],
      count: 2,
      next: null,
      previous: null,
    });
  });
});
