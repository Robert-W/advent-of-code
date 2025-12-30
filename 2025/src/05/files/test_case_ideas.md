## Ranges / Cases to test
- Start with 0:  `0-50`
- Range consumes other ranges: `1-10, 2-6`
- Duplicate ranges in the input: `1-10, 1-10`,
- Ranges that start/end on another range: `1-5, 5-10, 10-15`

## Tweaks to my solution
- Try sorting the ranges by their min value
- Could track overlaps when looping through the sorted list. E.g. track the
  current low, if the next range overlaps, continue, otherwise, add the range
  and reset the low.
    - [1-7,6-12, 14-18] could set low to 1, then when on 6-11, 6 < 7, so keep
    low and keep moving. When on 14-18, 14 > 12 so add low (1) to 12, and set
    low to 14. Move to the next one. This should mean sort and one pass to sum.
