#!/bin/bash

input=$1
echo "${input}"
cd "${input}"

touch feedback.csv
touch temp.txt

echo "username,feedback,grade" > feedback.csv
for f in *.py
do	
	echo here
	marks=0
	python3 $f > temp.txt
	
	if cmp -s "./out.txt" "./temp.txt";
	then
		((marks += 100))
	fi
	
	mails=($(echo $f | tr "_" "\n"))

	echo "${mails[0]}"
	feedback='need improvement'
	if (( $marks > 0 )); then
	    feedback='good'
	fi
	
	str="${mails[0]}","$feedback","$marks"
	echo $str >> feedback.csv
	
done
rm temp.txt
