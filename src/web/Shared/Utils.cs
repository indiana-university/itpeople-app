using System;
using Microsoft.Extensions.Configuration;

namespace web
{
	public static class Utils
	{
		public static string Env(IConfiguration config, string key, bool required=false)
		{
			var result = config[key];
			if(required && string.IsNullOrWhiteSpace(result))
			{
				throw new Exception($"Missing required environment setting: {key}");
			}
			return result;
		}
	}
}