markov
------

Because I am apparently obsessed with Markov text generators.

```
node index.js --learn path --quantity num [--window num] [--start token]
```

Learn from `path`, either a file or directory (recursively on files), and then generate (up to, not guaranteed) `num` tokens in  Markov-ish process.

Optionally, process `num`-grams rather than bigrams.

To (try to) start with a particular token, pass (optionally) `token`.

Guarantees, Warranties, And Manatees
------------------------------------

None. This is a glorified proof of concept. Seriously, what do you expect?

One narwhal per customer.

Love/Hate Mail
--------------

[Jacob Prystowsky](https://github.com/jprystowsky)

License
-------
MIT