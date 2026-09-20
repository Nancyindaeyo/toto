import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeTheaterFavoriteTitle, theaterFavoriteDisplayTitle } from '../src/theaterFavorites.js';

test('favorite viewer title drops swipe chrome leftover in saved names', () => {
    assert.equal(
        sanitizeTheaterFavoriteTitle('【兔子镜：极秘·小海带驯化手帐】‹1/1›×'),
        '【兔子镜：极秘·小海带驯化手帐】',
    );
    assert.equal(
        theaterFavoriteDisplayTitle({ title: '【兔子镜：梦境】< 2 / 5 >×  extra' }),
        '【兔子镜：梦境】 extra',
    );
});
