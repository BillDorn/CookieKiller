#!/usr/bin/env python
import sys
import json

VALUE_KEY = "!"

def encode(s):
	if s == "*":
		return s
	if len(s) and s[0] == "!":
		return "!" + str(s[1:].encode("idna"), "utf-8")
	return str(s.encode("idna"), "utf-8")

def parse(data_file):
	tree = {VALUE_KEY: 0}
	for line in data_file.readlines():#[:50]:
		if line[:2] not in ("//", "\n"):
			rule = line.strip().split(".")
			rule = [encode(label) for label in rule]
			insert(tree, rule)
	return tree

def insert(parent, rule, index=-1):
	label = rule[index]
	if -index == len(rule):
		kind = 1
		if label[0] == "!":
			label, kind = label[1:], 2
		parent[label] = parent.get(label, {VALUE_KEY: kind})
		return
	if label not in parent:
		parent[label] = {VALUE_KEY: 0}
	insert(parent[label], rule, index-1)

if __name__ == "__main__":
	infile,outfile = sys.argv[1],sys.argv[2]
	with open(infile, "r") as data_file:
		tree = parse(data_file)
	with open(outfile, "w") as json_file:
		json.dump(tree, json_file, ensure_ascii=True, indent=None, separators=(",",":"))