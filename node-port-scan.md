# Port scanner

Let's write a port scanner!

A port scanner is a program which receives a bunch of hosts and ports, and says which ports are open, and which are closed.

## Description

- Using node v16, write a port scanner
- Read an input file, where each line is a `hostname port` pair
- Hosts are scanned serially, ports in parallel
- Print how long DNS lookup for each host took, and the resolved address
- Have timeouts for both DNS lookup (4 seconds) and port scan (2 seconds per port)
- Accept a `--json` flag which will only output a JSON representation of the above

### Input

Read a list of host/port pairs read from a file named `input.txt`, which is formatted like so:

```
host port
host port
host port
...
```

For example:

```
localhost 8080
duckduckgo.com 80
duckduckgo.com 443
localhost 22
duckduckgo.com 9999
```

You may assume the `input.txt` file is well-formatted. You won't get invalid ports, or duplicate lines, or lines with more than one space, etc.

### Scanning

The hosts will be scanned serially, but ports will be scanned in parallel.

For this example, `localhost` is first scanned, attempting `8080` and `22` in parallel.
When `localhost` finishes being scanned, `duckduckgo.com` is now scanned, `80`, `443`, and `9999` in parallel.

It doesn't matter in which order individual hosts and ports are scanned.

A port is considered open if a connection to it can be established.

### DNS

The port scanner operates on hostnames and not IP addresses. That means there's a DNS lookup happening.
During operation, the scanner should say how long it took for the DNS lookup to happen, and what IP it resolved to.

Bonus points for making sure it also works for IPv6 addresses. They're about to become popular aaaannyyy day now.

### Timeout

Since the port scanner works over the internet, it is bound to at some point experience either (1) very slow connections (2) uncooperative hosts.
Make sure you have timeouts for both the DNS, and for checking whether the port is open.
Let's define that as 4 seconds for DNS, and 2 seconds per port check.

### Output

Usually, humans will run this program. We should do our due diligence and prepare for the robot uprising.

Our port scanner accepts a flag, `--json`. When passed, the program only prints one thing at the end: A JSON describing the result of the port scanning.
This will include any output previously mentioned. From (of course) the status of each port, to e.g. the time it took the DNS lookup.

## Notes
- This question is written in steps, and may be solved in such a way
  - To reach the submission date, you may skip certain steps, or choose to stop before reaching the end
- This question is written in English and Markdown, however feel comfortable to answer in any other common language and format
- If you have any questions, please do not hesitate to reach out and ask
