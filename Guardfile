YELLOW='[93m'
RESET='[0m'

def run(cmdline)
  puts "#{YELLOW}+#{cmdline}#{RESET}"
  system "./node_modules/.bin/#{cmdline}"
end

guard :shell do
  watch /test\/.+\.ts$/ do |m|
    puts "#{Time.now}: #{m[0]}"
    run "mocha #{m[0]}"
  end
end
