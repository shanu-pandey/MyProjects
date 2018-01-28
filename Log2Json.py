# convert log file into JSON file
inputFile = "tracks_json/beat_spawning_log";
# inputFile = "tracks_json/lunar_red_x_log.log";
outputFile =  "tracks_json/lunar_t.json";
beat_type = "enemy_full_02"; # 

def main():
	i_f = open(inputFile, 'r');
	o_f = open(outputFile, 'w');	
	line = i_f.readline();
	o_f.write("{\n  \"beats\":[\n");

	editor = False;

	while(line):
		print(line);
		if editor:
			ls = line.split();
			o_f.write("    {\"time\":");
			o_f.write(ls[-1]); # time
			o_f.write(", \"icon\":\"");
			o_f.write(beat_type); # type of beats sprites 
			o_f.write("\", \"piece\":");
			o_f.write((ls[1].split('_'))[1].split(':')[0]); # which piece to spawn
			o_f.write("},\n");
		else:
			ls = line.split();
			o_f.write("    {\"time\":");
			o_f.write(str(int(float(ls[0]) * 1000))); # time
			o_f.write(", \"icon\":\"");
			o_f.write(beat_type); # type of beats sprites 
			o_f.write("\", \"piece\":");
			o_f.write(ls[1]); # which piece to spawn
			o_f.write("},\n");
		line = i_f.readline();

	i_f.close();
	o_f.write("  ]\n}");
	o_f.close();



if __name__ == "__main__": main();